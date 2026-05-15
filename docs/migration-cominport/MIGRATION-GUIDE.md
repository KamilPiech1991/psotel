# MIGRACJA WordPress: cominport.pl → support.topstrony.pl

**Źródło:** cominport.pl (WordPress, SSL, GTranslate PL/EN, Calameo)
**Cel:** support.topstrony.pl (domena testowa)
**Typ strony:** Informacyjna (~10-12 podstron, bez WooCommerce)
**Data:** 15.05.2026

---

## METODA A: Plugin (REKOMENDOWANA — najszybsza, ~30 min)

### Krok 1: Zainstaluj Duplicator na cominport.pl

1. Zaloguj się do panelu WordPress: `https://cominport.pl/wp-admin`
2. Wtyczki → Dodaj nową → Szukaj: **"Duplicator"** (autor: Snap Creek)
3. Zainstaluj i aktywuj
4. Przejdź do: **Duplicator → Pakiety → Utwórz nowy**
5. Kliknij **Dalej** → Poczekaj na skan (powinien przejść — mała strona)
6. Kliknij **Buduj** → Poczekaj na zakończenie
7. Pobierz **dwa pliki**:
   - `installer.php`
   - `[data]-[hash]_archive.zip`

### Krok 2: Przygotuj support.topstrony.pl

1. Utwórz pustą bazę danych MySQL na serwerze support.topstrony.pl:
   - Nazwa bazy: np. `support_cominport`
   - Użytkownik bazy: np. `support_user`
   - Hasło: (zanotuj)
   - Przypisz użytkownika do bazy z PEŁNYMI UPRAWNIENIAMI
2. Upewnij się, że katalog docelowy na FTP jest pusty (np. `/public_html/` lub `/www/` dla support.topstrony.pl)
   - Jeśli support.topstrony.pl jest subdomeną — sprawdź ścieżkę w panelu hostingu

### Krok 3: Wgraj pliki na support.topstrony.pl

1. Połącz się przez FTP do support.topstrony.pl
2. Wgraj do katalogu głównego domeny:
   - `installer.php`
   - `[data]-[hash]_archive.zip`
3. **Tylko te 2 pliki — nic więcej!**

### Krok 4: Uruchom instalator

1. Otwórz w przeglądarce: `https://support.topstrony.pl/installer.php`
2. **Krok 1 — Deploy**: Zaakceptuj warunki, kliknij Next
3. **Krok 2 — Install Database**:
   - Action: `Create New Database` (lub `Connect and Remove All Data` jeśli baza już istnieje)
   - Host: `localhost` (zwykle)
   - Database: `support_cominport` (nazwa z kroku 2)
   - User: `support_user`
   - Password: (hasło z kroku 2)
   - Kliknij **Test Database** → powinno pokazać zielone ✓
   - Kliknij **Next**
4. **Krok 3 — Update Data**:
   - **New URL:** `https://support.topstrony.pl` (BEZ ukośnika na końcu!)
   - **New Path:** zostaw automatycznie wypełnione (Duplicator wykryje ścieżkę)
   - Title: można zmienić na np. "COMINPORT [TEST]"
   - Kliknij **Next**
5. **Krok 4 — Test**: Kliknij Admin Login → zaloguj się tymi samymi danymi co do cominport.pl

### Krok 5: Sprzątanie po migracji

1. Zaloguj się do WP Admin: `https://support.topstrony.pl/wp-admin`
2. Duplicator automatycznie pokaże komunikat o usunięciu plików instalatora → **Kliknij „Remove Installation Files"**
3. Jeśli nie — ręcznie usuń przez FTP:
   - `installer.php`
   - `installer-backup.php` (jeśli istnieje)
   - `installer-data.sql` (jeśli istnieje)
   - `dup-installer/` (katalog, jeśli istnieje)
4. Przejdź do **Ustawienia → Bezpośrednie odnośniki** → Kliknij **Zapisz zmiany** (bez zmiany ustawień — to odświeża `.htaccess`)

### Krok 6: Weryfikacja

- [ ] Strona główna się ładuje
- [ ] Menu nawigacyjne działa (START, O NAS, PRODUKTY, etc.)
- [ ] Podstrony otwierają się (nie 404)
- [ ] Obrazki się wyświetlają
- [ ] GTranslate (przełącznik PL/EN) działa
- [ ] Katalog Calameo się wyświetla
- [ ] Formularz kontaktowy/newsletter działa
- [ ] Panel admin dostępny
- [ ] Brak odniesień do cominport.pl w treści (Ctrl+U → Ctrl+F → „cominport")

---

## METODA B: Manualna (pełna kontrola, ~60 min)

### Krok 1: Eksport bazy danych cominport.pl

**Przez phpMyAdmin:**
1. Zaloguj się do phpMyAdmin na serwerze cominport.pl
2. Wybierz bazę danych WordPress
3. Kliknij **Eksport**
4. Metoda: **Szybka** (lub Zaawansowana jeśli baza > 50 MB)
5. Format: **SQL**
6. Kliknij **Wykonaj** → pobierz plik `.sql`

**Przez wiersz poleceń (jeśli masz SSH):**
```bash
mysqldump -u UŻYTKOWNIK -p NAZWA_BAZY > cominport_backup.sql
```

### Krok 2: Pobierz pliki przez FTP

1. Połącz się FTP do cominport.pl
2. Pobierz **cały katalog WordPress** (zwykle `/public_html/` lub `/www/`)
3. Kluczowe katalogi:
   - `wp-content/themes/` — motyw
   - `wp-content/plugins/` — wtyczki
   - `wp-content/uploads/` — media (zdjęcia, PDF-y, katalogi)
   - `wp-config.php` — konfiguracja
   - `.htaccess` — reguły serwera

### Krok 3: Utwórz bazę danych na support.topstrony.pl

(Jak w Metodzie A, Krok 2)

### Krok 4: Import bazy danych

**Przez phpMyAdmin:**
1. Zaloguj się do phpMyAdmin na serwerze support.topstrony.pl
2. Wybierz nową bazę danych
3. Kliknij **Import**
4. Wybierz plik `.sql` z kroku 1
5. Kliknij **Wykonaj**

**Jeśli plik jest za duży (> limit phpMyAdmin):**
- Podziel plik SQL na mniejsze części narzędziem BigDump
- Lub użyj SSH: `mysql -u UŻYTKOWNIK -p NAZWA_BAZY < cominport_backup.sql`

### Krok 5: Wgraj pliki na support.topstrony.pl

1. Połącz się FTP do support.topstrony.pl
2. Wgraj wszystkie pliki WordPress do katalogu głównego domeny

### Krok 6: Edytuj wp-config.php

Otwórz `wp-config.php` na serwerze support.topstrony.pl i zmień:

```php
// ZMIEŃ dane bazy danych:
define( 'DB_NAME', 'support_cominport' );      // Nowa nazwa bazy
define( 'DB_USER', 'support_user' );            // Nowy użytkownik
define( 'DB_PASSWORD', 'TWOJE_NOWE_HASŁO' );    // Nowe hasło
define( 'DB_HOST', 'localhost' );                // Zwykle localhost

// OPCJONALNIE - wymuś nowy URL (zabezpieczenie):
define( 'WP_HOME', 'https://support.topstrony.pl' );
define( 'WP_SITEURL', 'https://support.topstrony.pl' );
```

### Krok 7: Search & Replace w bazie danych (KRYTYCZNE!)

WordPress zapisuje pełne URL-e w bazie. Musisz zamienić WSZYSTKIE wystąpienia `cominport.pl` na `support.topstrony.pl`.

**UWAGA:** NIE rób tego prostym SQL REPLACE — WordPress używa serializowanych danych (np. w opcjach widgetów, Elementor, GTranslate), a prosty REPLACE zepsuje serializację!

**Użyj jednego z tych narzędzi:**

#### Opcja A: Wtyczka Better Search Replace (najłatwiej)
1. Zaloguj się do `https://support.topstrony.pl/wp-admin`
   (Jeśli nie działa — dodaj linie WP_HOME/WP_SITEURL do wp-config.php jak w kroku 6)
2. Wtyczki → Dodaj nową → **Better Search Replace**
3. Zainstaluj i aktywuj
4. Narzędzia → Better Search Replace:
   - **Search for:** `cominport.pl`
   - **Replace with:** `support.topstrony.pl`
   - **Select tables:** ZAZNACZ WSZYSTKIE
   - **Run as dry run:** ✅ NAJPIERW zaznacz (test bez zmian)
   - Kliknij **Run** → sprawdź ile znaleziono
   - Odznacz „dry run" → Kliknij **Run** (faktyczna zamiana)
5. Powtórz dla wariantu z `https://`:
   - Search: `https://cominport.pl`
   - Replace: `https://support.topstrony.pl`
6. Powtórz dla wariantu bez `www`:
   - Search: `http://cominport.pl`
   - Replace: `https://support.topstrony.pl`

#### Opcja B: Skrypt interconnect/it Search Replace DB
1. Pobierz: https://interconnectit.com/search-and-replace-for-wordpress-databases/
2. Wgraj rozpakowany folder na FTP do: `support.topstrony.pl/search-replace-db/`
3. Otwórz: `https://support.topstrony.pl/search-replace-db/`
4. Search: `cominport.pl` → Replace: `support.topstrony.pl`
5. Kliknij **Dry Run** → potem **Live Run**
6. **KONIECZNIE usuń folder `search-replace-db/` po zakończeniu!** (bezpieczeństwo)

### Krok 8: Permalinki i .htaccess

1. WP Admin → Ustawienia → Bezpośrednie odnośniki → **Zapisz zmiany** (regeneruje .htaccess)

### Krok 9: Weryfikacja

(Taka sama jak w Metodzie A, Krok 6)

---

## DODATKOWE KROKI PO MIGRACJI

### Zabezpieczenie strony testowej

Ponieważ to domena **testowa**, warto ją zabezpieczyć przed indeksowaniem i nieautoryzowanym dostępem:

#### 1. Zablokuj indeksowanie przez Google
WP Admin → Ustawienia → Czytanie → ✅ **„Proś wyszukiwarki o nieindeksowanie tej witryny"**

#### 2. Dodaj .htaccess basic auth (hasło na stronę)
Utwórz plik `.htpasswd` (np. generatorem: htpasswd-generator.de):
```
admin:$apr1$xyz...hasło...
```

Dodaj na początku `.htaccess`:
```apache
# Zabezpieczenie hasłem — strona testowa
AuthType Basic
AuthName "Strona testowa — dostęp ograniczony"
AuthUserFile /pełna/ścieżka/do/.htpasswd
Require valid-user

# Wyjątek dla wp-cron (potrzebny do zaplanowanych zadań)
<Files wp-cron.php>
    Satisfy Any
    Allow from all
</Files>
```

#### 3. Wyłącz GTranslate na teście (opcjonalnie)
Jeśli GTranslate korzysta z API z limitem — wyłącz go na domenie testowej, żeby nie zużywać limitu.

#### 4. Sprawdź, czy poczta nie idzie do klientów
Jeśli strona ma formularze wysyłające maile — upewnij się, że maile testowe nie trafiają do realnych odbiorców.

### Zabezpieczenie WordPressa (ogólne)

- [ ] Zaktualizuj WordPress do najnowszej wersji
- [ ] Zaktualizuj wszystkie wtyczki
- [ ] Zaktualizuj motyw
- [ ] Zmień hasło admina (jeśli to samo co na produkcji)
- [ ] Zainstaluj Wordfence lub Sucuri Security
- [ ] Sprawdź, czy `wp-config.php` nie jest publicznie dostępny
- [ ] Wyłącz edycję plików z panelu: dodaj do wp-config.php: `define('DISALLOW_FILE_EDIT', true);`
- [ ] Zmień prefiks tabel (jeśli standardowy `wp_`) — na przyszłość

---

## TROUBLESHOOTING

### Problem: „Error establishing a database connection"
- Sprawdź dane w wp-config.php (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)
- Sprawdź, czy użytkownik ma uprawnienia do bazy

### Problem: Strona przekierowuje na cominport.pl
- Sprawdź wp-config.php — czy dodałeś WP_HOME i WP_SITEURL
- Wykonaj Search & Replace w bazie (krok 7)
- Wyczyść cache przeglądarki

### Problem: Białe strony / Error 500
- Włącz debug: w wp-config.php ustaw `define('WP_DEBUG', true);`
- Sprawdź logi błędów serwera (error_log)
- Najczęściej: brak modułu PHP, za mały limit pamięci
- Dodaj do wp-config.php: `define('WP_MEMORY_LIMIT', '256M');`

### Problem: Obrazki się nie wyświetlają
- Search & Replace nie objął ścieżek do mediów
- Powtórz Search & Replace (krok 7) z wariantami URL

### Problem: Podstrony zwracają 404
- Przejdź do Ustawienia → Bezpośrednie odnośniki → Zapisz zmiany
- Sprawdź, czy .htaccess ma poprawne reguły rewrite
- Sprawdź, czy `mod_rewrite` jest włączony na serwerze

### Problem: GTranslate nie działa
- Może wymagać ponownej konfiguracji na nowej domenie
- Sprawdź ustawienia wtyczki w WP Admin → GTranslate

### Problem: CSS/style się nie ładują
- Wyczyść cache (Ctrl+Shift+R)
- Sprawdź czy Search & Replace objął ścieżki do motywu
- Sprawdź konsolę przeglądarki (F12 → Console) pod kątem błędów mixed content (http vs https)
