from openai import OpenAI

from app.core.config import settings
from app.core.database import supabase


def _client() -> OpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    return OpenAI(api_key=settings.openai_api_key)


def get_embedding(text: str):
    response = _client().embeddings.create(
        input=text,
        model="text-embedding-3-small",
    )
    return response.data[0].embedding


def reflect_on_memories(user_id: str, query: str):
    query_vector = get_embedding(query)
    memories = supabase.rpc(
        "match_journal_entries",
        {
            "query_embedding": query_vector,
            "match_threshold": 0.5,
            "match_count": 5,
            "filter": {"user_id": user_id},
        },
    ).execute().data

    if not memories:
        return (
            "I don't have enough relevant journal entries yet. "
            "Add more investment reasoning and revisit this question later."
        )

    context = "\n".join(f"- {m.get('note', '')}" for m in memories)
    prompt = (
        "Review these historical investment journal entries:\n"
        f"{context}\n\n"
        "Answer the user's question using only patterns supported by those entries. "
        "Separate observations from inference, challenge weak reasoning, and never issue "
        "a buy/sell recommendation.\n\n"
        f"Question: {query}"
    )

    response = _client().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Market Memory, a reflective investment reasoning coach. "
                    "Help users examine their past reasoning. Do not provide buy/sell calls."
                ),
            },
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content
