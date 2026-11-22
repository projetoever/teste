"""GET LED CENAS — adaptadores de requisições de vídeo (somente planejamento).

Não faz requisições, não armazena chaves e não aprova resultados.
Os preços são referências verificadas em 2026-11-22, não garantias de cobrança.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urlparse

MODELS = {
    "v6": {
        "endpoint": "fal-ai/pixverse/v6/image-to-video",
        "duration": range(1, 16),
        "720p_usd_s": 0.045,
        "last_required": False,
    },
    "transition": {
        "endpoint": "fal-ai/pixverse/v6/transition",
        "duration": range(1, 16),
        "720p_usd_s": 0.045,
        "last_required": True,
    },
    "veofast": {
        "endpoint": "fal-ai/veo3.1/fast/first-last-frame-to-video",
        "duration": (4, 6, 8),
        "720p_usd_s": 0.10,
        "last_required": True,
    },
    "kling4": {
        "endpoint": "kling/v4/image-to-video",
        "duration": range(3, 31),
        "720p_usd_s": 0.157,
        "last_required": False,
    },
}


class PreflightError(ValueError):
    pass


def is_https_asset(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.scheme == "https" and bool(parsed.netloc) and not parsed.username and not parsed.password
    except Exception:
        return False


def prepare_request(job: dict[str, Any], first_url: str, last_url: str = "") -> dict[str, Any]:
    """Devolve payload preparado para o servidor. Não chama nenhum motor.

    Os URLs precisam apontar para mídias hospedadas com autorização; caminhos
    locais nunca devem ser enviados diretamente à API.
    """
    model_id = job.get("model", {}).get("id")
    if model_id not in MODELS:
        raise PreflightError("Motor desconhecido ou não homologado")
    model = MODELS[model_id]
    options = job.get("quality", {})
    duration = options.get("duration_s")
    resolution = options.get("resolution")
    prompt = job.get("prompt", "").strip()
    neg = job.get("negative_prompt", "").strip()

    if duration not in model["duration"]:
        raise PreflightError(f"Duração {duration!r} não suportada por {model_id}")
    if resolution not in ("720p", "1080p"):
        raise PreflightError("Use 720p para pilotos; 1080p somente após aprovação")
    if not is_https_asset(first_url):
        raise PreflightError("É necessário hospedar a primeira imagem em URL HTTPS autorizada")
    if model["last_required"] and not is_https_asset(last_url):
        raise PreflightError("É obrigatório preparar e hospedar o quadro final antes da transição")
    if len(prompt.encode("utf-8")) > 2048 or not prompt:
        raise PreflightError("Prompt principal obrigatório e limitado a 2048 bytes na fábrica")
    if len(neg.encode("utf-8")) > 2048:
        raise PreflightError("Prompt negativo excedeu 2048 bytes")
    if options.get("audio", False):
        raise PreflightError("Piloto da persiana deve ser gerado sem áudio")
    if options.get("aspect_ratio", "16:9") != "16:9":
        raise PreflightError("Piloto precisa ser 16:9")

    if model_id in ("v6", "transition"):
        payload = {
            "prompt": prompt,
            "negative_prompt": neg,
            "first_image_url": first_url,
            "aspect_ratio": "16:9",
            "resolution": resolution,
            "duration": duration,
            "generate_audio_switch": False,
            "generate_multi_clip_switch": False,
            "thinking_type": "disabled",
        }
        if model_id == "transition":
            payload["end_image_url"] = last_url
    elif model_id == "veofast":
        payload = {
            "prompt": prompt,
            "negative_prompt": neg,
            "first_frame_url": first_url,
            "last_frame_url": last_url,
            "aspect_ratio": "16:9",
            "resolution": resolution,
            "duration": f"{duration}s",
            "generate_audio": False,
        }
    else:
        payload = {
            "prompt": prompt + ("\nPreserve: " + neg if neg else ""),
            "start_image_url": first_url,
            "duration": duration,
            "resolution": resolution,
        }
        if is_https_asset(last_url):
            payload["end_image_url"] = last_url

    return {
        "endpoint": model["endpoint"],
        "input": payload,
        "estimated_720p_cost_usd": round(model["720p_usd_s"] * duration, 4) if resolution == "720p" else None,
        "requires_manual_approval": True,
        "may_publish": False,
    }
