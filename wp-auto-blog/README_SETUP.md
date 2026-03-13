# Auto Blog Publisher — AP Dent Piaseczno

Skrypt automatycznie generuje i publikuje posty blogowe SEO na WordPress.

## Instalacja

```bash
cd wp-auto-blog
pip3 install -r requirements.txt
```

## Konfiguracja

Dodaj klucz Anthropic do `~/.env`:

```
WP_URL=https://apdentpiaseczno.pl
WP_USER=Topstrony
WP_PASSWORD=iEVI 6lVJ OvTN nYOI rh8o 6WaO
ANTHROPIC_API_KEY=sk-ant-TWOJ_KLUCZ
```

## Użycie

```bash
# Podgląd następnego tematu
python3 auto_blog.py --preview

# Wygeneruj post bez publikacji (zapis do pliku JSON)
python3 auto_blog.py --dry-run

# Wygeneruj i opublikuj jako DRAFT (do przejrzenia w WordPress)
python3 auto_blog.py

# Wygeneruj i opublikuj od razu (bez draftu)
python3 auto_blog.py --publish
```

## Automatyzacja (cron co 3 dni)

```bash
crontab -e
```

Dodaj linię:

```
0 9 */3 * * cd /home/user/psotel/wp-auto-blog && /usr/bin/python3 auto_blog.py >> /home/user/psotel/wp-auto-blog/cron.log 2>&1
```

Skrypt uruchomi się co 3 dni o 9:00 rano.

## Pliki

- `topics.json` — lista 15 tematów z frazami kluczowymi
- `state.json` — stan (które tematy już opublikowano)
- `auto_blog.py` — główny skrypt
- `auto_blog.log` — log działania

## Dodawanie nowych tematów

Edytuj `topics.json` i dodaj nowe obiekty:

```json
{
  "keyword": "fraza kluczowa",
  "title_hint": "Sugerowany tytuł artykułu",
  "angle": "Opis kąta/podejścia artykułu"
}
```
