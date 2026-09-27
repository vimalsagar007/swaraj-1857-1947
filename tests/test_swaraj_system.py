import os
import sys
import unittest

# Ensure project root is in import path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.orchestrator import OrchestratorAgent

class TestSwarajSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
        cls.orchestrator = OrchestratorAgent(data_dir=data_dir)

    def test_q1_bhagat_singh(self):
        res = self.orchestrator.process_query("Tell me about Bhagat Singh.")
        self.assertIn("Bhagat Singh", res["answer"])
        self.assertTrue(len(res["citations"]) > 0)
        self.assertEqual(res["fact_check_status"], "SUPPORTED")

    def test_q2_rani_lakshmibai(self):
        res = self.orchestrator.process_query("What was the contribution of Rani Lakshmibai?")
        self.assertIn("Rani Lakshmibai", res["answer"])
        self.assertTrue(len(res["citations"]) > 0)

    def test_q3_women_freedom_fighters(self):
        res = self.orchestrator.process_query("Who were the women freedom fighters?")
        self.assertIn("Women Leaders", str(res) + res["answer"])

    def test_q4_andhra_pradesh(self):
        res = self.orchestrator.process_query("Show freedom fighters connected with Andhra Pradesh.")
        self.assertTrue("Andhra" in res["answer"] or "Raju" in str(res))

    def test_q5_quit_india(self):
        res = self.orchestrator.process_query("What happened during the Quit India Movement?")
        self.assertTrue("Quit India" in res["answer"] or "1942" in res["answer"])

    def test_q6_subhas_chandra_bose_images(self):
        res = self.orchestrator.process_query("Find historical images of Subhas Chandra Bose.")
        self.assertTrue(len(res["images"]) > 0)
        # Verify AI images are explicitly tagged
        for img in res["images"]:
            if img["is_ai_generated"]:
                self.assertEqual(img["license"], "AI-generated historical visualization")

    def test_q7_timeline_1857_1947(self):
        res = self.orchestrator.process_query("Give me the timeline from 1857 to 1947.")
        self.assertIsNotNone(res["answer"])

    def test_q8_compare_movements(self):
        res = self.orchestrator.process_query("Compare Non-Cooperation and Civil Disobedience.")
        self.assertIsNotNone(res["answer"])

    def test_q9_kakori_action(self):
        res = self.orchestrator.process_query("Who participated in the Kakori action?")
        self.assertTrue("Kakori" in str(res) or "Bismil" in str(res))

    def test_q10_alluri_sitarama_raju_sources(self):
        res = self.orchestrator.process_query("Show me reliable sources about Alluri Sitarama Raju.")
        self.assertTrue(len(res["citations"]) > 0)

if __name__ == "__main__":
    unittest.main()
