import unittest
from adapters import MODELS, PreflightError, prepare_request


class AdapterTest(unittest.TestCase):
    def setUp(self):
        self.job = {
            "model": {"id": "transition"},
            "quality": {"duration_s": 5, "resolution": "720p", "aspect_ratio": "16:9", "audio": False},
            "prompt": "Motorized blind lowers inside the existing window, locked camera.",
            "negative_prompt": "camera movement, duplicated screen, warped furniture",
        }
        self.first = "https://example.com/first.jpg"
        self.last = "https://example.com/last.jpg"

    def test_transition_requires_last(self):
        with self.assertRaises(PreflightError):
            prepare_request(self.job, self.first)

    def test_transition_schema(self):
        out = prepare_request(self.job, self.first, self.last)
        self.assertEqual(out["input"]["end_image_url"], self.last)
        self.assertEqual(out["estimated_720p_cost_usd"], .225)
        self.assertFalse(out["may_publish"])

    def test_veo_duration(self):
        self.job["model"]["id"] = "veofast"
        with self.assertRaises(PreflightError):
            prepare_request(self.job, self.first, self.last)
        self.job["quality"]["duration_s"] = 6
        out = prepare_request(self.job, self.first, self.last)
        self.assertEqual(out["input"]["duration"], "6s")
        self.assertEqual(out["estimated_720p_cost_usd"], .60)

    def test_kling(self):
        self.job["model"]["id"] = "kling4"
        out = prepare_request(self.job, self.first, self.last)
        self.assertEqual(out["input"]["start_image_url"], self.first)
        self.assertEqual(out["input"]["end_image_url"], self.last)

    def test_not_accept_http_or_local_paths(self):
        for bad in ["http://example.com/first.jpg", "inputs/first.jpg", "", "file:///tmp/test.png"]:
            with self.assertRaises(PreflightError):
                prepare_request(self.job, bad, self.last)

    def test_no_audio(self):
        self.job["quality"]["audio"] = True
        with self.assertRaises(PreflightError):
            prepare_request(self.job, self.first, self.last)


if __name__ == "__main__":
    unittest.main()
