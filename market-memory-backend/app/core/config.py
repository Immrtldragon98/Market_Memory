"""Application configuration loaded exclusively from environment variables."""
from __future__ import annotations

import os
from dataclasses import dataclass


def _required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def _csv(name: str, default: str = "") -> list[str]:
    raw = os.getenv(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    supabase_url: str
    supabase_key: str
    openai_api_key: str | None
    cors_origins: list[str]


def load_settings() -> Settings:
    return Settings(
        supabase_url=_required("SUPABASE_URL"),
        supabase_key=_required("SUPABASE_KEY"),
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        cors_origins=_csv(
            "CORS_ORIGINS",
            "http://localhost:8081,http://localhost:19006,http://localhost:3000",
        ),
    )


settings = load_settings()
