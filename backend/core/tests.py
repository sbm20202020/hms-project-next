from django.test import TestCase

from .models import Organisation, User


class HealthCheckTests(TestCase):
    def test_health_check_returns_ok(self):
        response = self.client.get("/api/health/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


class SignupTests(TestCase):
    def test_signup_creates_user(self):
        payload = {
            "name": "Alice Dupont",
            "email": "alice@example.com",
            "password": "securepass",
        }
        response = self.client.post(
            "/api/auth/signup/", data=payload, content_type="application/json"
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json().get("ok"))
        self.assertTrue(User.objects.filter(email="alice@example.com").exists())

    def test_signup_duplicate_email_returns_error(self):
        org = Organisation.objects.create()
        User.objects.create(email="bob@example.com", password="x", organisation=org)

        payload = {"name": "Bob", "email": "bob@example.com", "password": "anypass"}
        response = self.client.post(
            "/api/auth/signup/", data=payload, content_type="application/json"
        )

        self.assertEqual(response.status_code, 409)
        self.assertFalse(response.json().get("ok"))


class AuthTokenTests(TestCase):
    def setUp(self):
        org = Organisation.objects.create()
        User.objects.create_user(
            email="test@example.com", password="testpass123", organisation=org
        )

    def test_obtain_token(self):
        response = self.client.post(
            "/api/auth/token/",
            data={"email": "test@example.com", "password": "testpass123"},
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("access", response.json())
        self.assertIn("refresh", response.json())

