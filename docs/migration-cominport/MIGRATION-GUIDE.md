# MIGRACJA WordPress: cominport.pl → support.topstrony.pl

**Źródło:** cominport.pl (WordPress, SSL, GTranslate PL/EN, Calameo)
**Cel:** support.topstrony.pl (domena testowa)
**Dostęp:** FTP + baza danych (phpMyAdmin) — BEZ panelu WordPress
**Uwaga:** Strona nieużywana od kilku lat — możliwy przestarzały WP i wtyczki

---

## PROCEDURA KROK PO KROKU (~45–60 min)

---

### KROK 1: Eksport bazy danych cominport.pl

1. Zaloguj się do **phpMyAdmin** na serwerze cominport.pl
2. W panelu bocznym kliknij nazwę bazy danych WordPress (np. `cominport_db` lub podobna — jeśli nie wiesz która, poszukaj tabel z prefiksem `wp_`)
3. Kliknij zakładkę **Eksport** (u góry)
4. Metoda eksportu: **Szybka**
5. Format: **SQL**
6. Kliknij **Wykonaj** → przeglądarka pobierze plik np. `cominport_db.sql`

**Jak znaleźć nazwę bazy?** Jeśli nie pamiętasz — podłącz się FTP do cominport.pl, pobierz plik `wp-config.php` i poszukaj linii:
```php
define( 'DB_NAME', 'tutaj_nazwa_bazy' );
define( 'DB_USER', 'tutaj_uzytkownik' );
define( 'DB_PASSWORD', 'tutaj_haslo' );
```
Te dane potrzebujesz również do potwierdzenia, że łączysz się z właściwą bazą.

---

### KROK 2: Pobierz WSZYSTKIE pliki przez FTP z cominport.pl

1. Połącz się przez FTP (np. FileZilla) do cominport.pl
2. Przejdź do katalogu głównego strony (zwykle `/public_html/`, `/www/` lub `/htdocs/`)
3. Pobierz **cały katalog** na swój komputer — WSZYSTKO, łącznie z:
   - `wp-admin/`
   - `wp-content/` (motyw, wtyczki, media)
   - `wp-includes/`
   - `wp-config.php`
   - `.htaccess`
   - `index.php`
   - Wszystkie pozostałe pliki

**Wskazówka:** W FileZilla zaznacz wszystko (Ctrl+A) → prawym kliskiem → Pobierz. Dla strony ~10-12 podstron to pewnie 200–500 MB (głównie `wp-content/uploads/`).

**Zanim pobierzesz** — zajrzyj do `wp-config.php` przez FTP i zanotuj:
- `DB_NAME` — nazwa bazy
- `DB_USER` — użytkownik
- `DB_PASSWORD` — hasło
- `DB_HOST` — host (zwykle `localhost`)
- `$table_prefix` — prefiks tabel (zwykle `wp_`)

---

### KROK 3: Utwórz bazę danych na serwerze support.topstrony.pl

1. W panelu hostingu support.topstrony.pl utwórz:
   - **Nową bazę danych**, np. `support_cominport`
   - **Nowego użytkownika bazy**, np. `support_dbuser`
   - **Hasło** — zanotuj
   - **Przypisz użytkownika do bazy** z uprawnieniami **ALL PRIVILEGES**

---

### KROK 4: Import bazy danych na support.topstrony.pl

1. Zaloguj się do **phpMyAdmin** na serwerze support.topstrony.pl
2. Kliknij nazwę nowej bazy danych (z kroku 3)
3. Kliknij zakładkę **Import**
4. Kliknij **Wybierz plik** → wskaż plik `.sql` pobrany w kroku 1
5. Kodowanie: **utf8** (lub utf8mb4)
6. Kliknij **Wykonaj**

**Jeśli plik jest za duży** (phpMyAdmin ma limit np. 50 MB):
- Skompresuj plik `.sql` do `.sql.gz` (phpMyAdmin przyjmuje gzip)
- Lub podziel na mniejsze części darmowym narzędziem **SQL Dump Splitter**
- Lub poproś hosting o zwiększenie limitu importu

**Weryfikacja:** Po imporcie powinieneś zobaczyć tabele WordPress (np. `wp_posts`, `wp_options`, `wp_users`, itp.)

---

### KROK 5: Wgraj pliki na support.topstrony.pl przez FTP

1. Połącz się FTP do support.topstrony.pl
2. Przejdź do katalogu głównego domeny (sprawdź w panelu hostingu jaka ścieżka obsługuje support.topstrony.pl — np. `/public_html/`, `/support/`, `/domains/support.topstrony.pl/public_html/`)
3. Wgraj **WSZYSTKIE pliki** pobrane w kroku 2 do tego katalogu

---

### KROK 6: Edytuj wp-config.php na support.topstrony.pl

Przez FTP otwórz plik `wp-config.php` na serwerze support.topstrony.pl i zmień **4 rzeczy**:

```php
// 1. ZMIEŃ DANE BAZY (na te z kroku 3):
define( 'DB_NAME', 'support_cominport' );
define( 'DB_USER', 'support_dbuser' );
define( 'DB_PASSWORD', 'TWOJE_NOWE_HASŁO' );
define( 'DB_HOST', 'localhost' );

// 2. DODAJ TE 2 LINIE (gdziekolwiek przed "That's all, stop editing!"):
define( 'WP_HOME', 'https://support.topstrony.pl' );
define( 'WP_SITEURL', 'https://support.topstrony.pl' );

// 3. DODAJ DEBUG (tymczasowo, do diagnostyki — usuń po migracji):
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );

// 4. ZWIĘKSZ PAMIĘĆ (stary WP może potrzebować):
define( 'WP_MEMORY_LIMIT', '256M' );
```

Zapisz plik i wgraj z powrotem na serwer.

---

### KROK 7: Search & Replace URL w bazie (KRYTYCZNY KROK!)

WordPress trzyma pełne URL-e (`https://cominport.pl/...`) w setkach miejsc w bazie. **Bez zamiany strona będzie przekierowywać na cominport.pl.**

Ponieważ nie masz panelu WP — użyjemy **skryptu PHP wgranego przez FTP**.

#### Opcja A: Skrypt Search Replace DB (REKOMENDOWANE)

1. Pobierz skrypt **Search Replace DB** z GitHub:
   `https://github.com/interconnectit/Search-Replace-DB`
   (kliknij zielony przycisk **Code → Download ZIP**)

2. Rozpakuj ZIP na swoim komputerze

3. Przez FTP wgraj cały rozpakowany folder do katalogu strony jako:
   `support.topstrony.pl/srdb/`

4. Otwórz w przeglądarce: `https://support.topstrony.pl/srdb/`

5. Skrypt automatycznie wykryje bazę z wp-config.php. Wypełnij:
   - **Search for:** `https://cominport.pl`
   - **Replace with:** `https://support.topstrony.pl`

6. Kliknij **Dry Run** (testowy przebieg — nic nie zmienia, tylko pokazuje co znajdzie)

7. Sprawdź wyniki — powinno znaleźć kilkaset/kilka tysięcy wystąpień

8. Kliknij **Live Run** (faktyczna zamiana)

9. Powtórz dla dodatkowych wariantów:

   | Search for | Replace with |
   |---|---|
   | `https://cominport.pl` | `https://support.topstrony.pl` |
   | `http://cominport.pl` | `https://support.topstrony.pl` |
   | `https://www.cominport.pl` | `https://support.topstrony.pl` |
   | `http://www.cominport.pl` | `https://support.topstrony.pl` |
   | `//cominport.pl` | `//support.topstrony.pl` |

10. **KONIECZNIE USUŃ folder `srdb/` po zakończeniu!**
    Przez FTP skasuj cały katalog `srdb/`. Pozostawienie go to **krytyczna luka bezpieczeństwa** — każdy kto trafi na ten URL może edytować bazę.

#### Opcja B: Zapytania SQL w phpMyAdmin (szybsze ale ryzykowniejsze)

Jeśli skrypt z Opcji A nie zadziała, otwórz phpMyAdmin → bazę support.topstrony.pl → zakładka **SQL** i wykonaj te zapytania **jedno po drugim**:

```sql
-- Zamiana URL w tabeli opcji
UPDATE wp_options SET option_value = REPLACE(option_value, 'https://cominport.pl', 'https://support.topstrony.pl') WHERE option_value LIKE '%cominport.pl%';

-- Zamiana URL w postach
UPDATE wp_posts SET post_content = REPLACE(post_content, 'https://cominport.pl', 'https://support.topstrony.pl');
UPDATE wp_posts SET post_excerpt = REPLACE(post_excerpt, 'https://cominport.pl', 'https://support.topstrony.pl');
UPDATE wp_posts SET guid = REPLACE(guid, 'https://cominport.pl', 'https://support.topstrony.pl');

-- Zamiana URL w metadanych postów
UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'https://cominport.pl', 'https://support.topstrony.pl') WHERE meta_value LIKE '%cominport.pl%';

-- Zamiana URL w komentarzach
UPDATE wp_comments SET comment_content = REPLACE(comment_content, 'https://cominport.pl', 'https://support.topstrony.pl');
UPDATE wp_comments SET comment_author_url = REPLACE(comment_author_url, 'https://cominport.pl', 'https://support.topstrony.pl');

-- Powtórz dla wariantu http://
UPDATE wp_options SET option_value = REPLACE(option_value, 'http://cominport.pl', 'https://support.topstrony.pl') WHERE option_value LIKE '%cominport.pl%';
UPDATE wp_posts SET post_content = REPLACE(post_content, 'http://cominport.pl', 'https://support.topstrony.pl');
UPDATE wp_postmeta SET meta_value = REPLACE(meta_value, 'http://cominport.pl', 'https://support.topstrony.pl') WHERE meta_value LIKE '%cominport.pl%';

-- Wymuś prawidłowe URL-e w opcjach
UPDATE wp_options SET option_value = 'https://support.topstrony.pl' WHERE option_name = 'siteurl';
UPDATE wp_options SET option_value = 'https://support.topstrony.pl' WHERE option_name = 'home';
```

**UWAGA:** Jeśli prefiks tabel to nie `wp_` tylko inny (np. `comi_`) — zamień `wp_` na właściwy prefiks we WSZYSTKICH zapytaniach.

**UWAGA 2:** SQL REPLACE nie obsługuje serializowanych danych PHP. Jeśli po tej operacji widgety, menu lub ustawienia wtyczek (GTranslate!) będą zepsute — użyj Opcji A (skrypt Search Replace DB) który prawidłowo obsługuje serializację.

---

### KROK 8: Napraw .htaccess

Przez FTP edytuj plik `.htaccess` w katalogu głównym support.topstrony.pl. Upewnij się, że zawiera standardowe reguły WordPress:

```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

Jeśli stary `.htaccess` miał przekierowania na `cominport.pl` lub reguły SSL specyficzne dla starej domeny — **usuń je** lub podmień na nową domenę.

---

### KROK 9: Reset hasła admina (nie znasz hasła do WP)

Skoro nikt nie logował się od lat, prawdopodobnie nie pamiętasz hasła. Zresetuj je przez phpMyAdmin:

1. Otwórz phpMyAdmin → baza support.topstrony.pl → tabela **`wp_users`**
2. Kliknij **Edytuj** przy koncie admina (zwykle ID=1)
3. W polu **`user_pass`**:
   - Z rozwijanego menu funkcji wybierz **MD5**
   - Wpisz nowe hasło, np. `TymczasoweHaslo2026!`
4. Kliknij **Wykonaj**
5. WordPress automatycznie przerobhashuje hasło na bezpieczniejszy algorytm przy pierwszym logowaniu

Teraz możesz się zalogować: `https://support.topstrony.pl/wp-admin`
- Login: (sprawdź kolumnę `user_login` w tabeli `wp_users`)
- Hasło: `TymczasoweHaslo2026!` (lub co ustawiłeś)

---

### KROK 10: Weryfikacja po migracji

Otwórz `https://support.topstrony.pl` i sprawdź:

- [ ] Strona główna się ładuje (nie biały ekran, nie "Error establishing a database connection")
- [ ] Nie przekierowuje na cominport.pl
- [ ] Menu nawigacyjne (START, O NAS, PRODUKTY, NAJCZĘŚCIEJ KUPOWANE, AKTUALNOŚCI, KONTAKT, KATALOG)
- [ ] Podstrony otwierają się (nie 404)
- [ ] Obrazki/zdjęcia się wyświetlają
- [ ] GTranslate (przełącznik PL/EN) działa
- [ ] Katalog Calameo się wyświetla
- [ ] WP Admin działa (`/wp-admin`)
- [ ] Ctrl+U → Ctrl+F → szukaj "cominport" → NIE powinno nic znaleźć
- [ ] F12 → Console → brak błędów "mixed content" lub 404 na zasobach

---

## ZABEZPIECZENIE STRONY TESTOWEJ

### 1. Zablokuj indeksowanie (przez FTP — bez panelu WP)

Edytuj plik `robots.txt` w katalogu głównym (utwórz jeśli nie istnieje):

```
User-agent: *
Disallow: /
```

Dodatkowo, przez FTP edytuj plik aktywnego motywu `wp-content/themes/[NAZWA_MOTYWU]/header.php` — znajdź tag `<head>` i dodaj zaraz po nim:

```html
<meta name="robots" content="noindex, nofollow">
```

Albo prostsze — dodaj do `wp-config.php`:
```php
// Po zalogowaniu do WP Admin ustaw noindex w Ustawienia → Czytanie
// Na razie blokujemy robotstxt
```

### 2. Zabezpiecz hasłem .htaccess (Basic Auth)

Wygeneruj hasło na: https://www.htaccesstools.com/htpasswd-generator/
- Username: `admin`
- Password: (Twoje hasło)
- Skopiuj wynikową linię, np.: `admin:$apr1$xyz...`

Utwórz plik `.htpasswd` przez FTP **POZA katalogiem public** (np. `/home/user/.htpasswd`).
Jeśli nie masz dostępu poza public — wstaw go do katalogu głównego.

Wklej wygenerowaną linię do `.htpasswd`.

Na początku `.htaccess` (PRZED regułami WordPress) dodaj:

```apache
# --- STRONA TESTOWA - ZABEZPIECZENIE HASŁEM ---
AuthType Basic
AuthName "Dostep ograniczony"
AuthUserFile /pelna/sciezka/do/.htpasswd
Require valid-user

# Wyjątek dla wp-cron
<Files wp-cron.php>
    Satisfy Any
    Allow from all
</Files>
# --- KONIEC ZABEZPIECZENIA ---
```

**Ścieżkę do `.htpasswd`** musisz podać jako ścieżkę absolutną na serwerze (np. `/home/supporttop/public_html/.htpasswd`). Sprawdź ją w phpMyAdmin lub panelu hostingu, albo utwórz plik PHP:

```php
<?php echo __DIR__; ?>
```

Wgraj go jako `path.php`, otwórz `https://support.topstrony.pl/path.php` — pokaże pełną ścieżkę. **Usuń plik po sprawdzeniu.**

### 3. Wyłącz debug po weryfikacji

Po potwierdzeniu, że wszystko działa — w `wp-config.php` zmień:
```php
define( 'WP_DEBUG', false );
```

---

## TROUBLESHOOTING

### "Error establishing a database connection"
→ Sprawdź dane w wp-config.php: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST

### Strona przekierowuje na cominport.pl
→ Sprawdź czy WP_HOME i WP_SITEURL są w wp-config.php
→ Wykonaj Search & Replace (krok 7) — pewnie nie objął wszystkich tabel
→ Wyczyść cache przeglądarki (Ctrl+Shift+Del) lub otwórz w trybie incognito

### Biały ekran / Error 500
→ Sprawdź `wp-content/debug.log` przez FTP (jeśli włączyłeś WP_DEBUG_LOG)
→ Najczęściej: niekompatybilna wersja PHP (stary WP może wymagać PHP 7.x, a serwer ma 8.x)
→ Sprawdź w panelu hostingu jaką wersję PHP ma support.topstrony.pl
→ Spróbuj PHP 7.4 jeśli WP jest bardzo stary

### Podstrony zwracają 404
→ Sprawdź czy .htaccess ma reguły WordPress (krok 8)
→ Sprawdź czy `mod_rewrite` jest włączony na serwerze
→ Jeśli masz dostęp do WP Admin — Ustawienia → Bezpośrednie odnośniki → Zapisz

### Obrazki się nie wyświetlają
→ Ctrl+U → szukaj "cominport" — jeśli znajdziesz, Search & Replace nie objął mediów
→ Powtórz krok 7 z wariantem `//cominport.pl`

### CSS/style się nie ładują
→ F12 → Console → szukaj "mixed content" lub 404 na plikach .css/.js
→ Prawdopodobnie Search & Replace nie objął ścieżek w motywniu
→ Sprawdź czy SSL działa na support.topstrony.pl

### GTranslate nie działa
→ Wtyczka może wymagać rekonfiguracji na nowej domenie
→ Po zalogowaniu do WP Admin sprawdź Ustawienia → GTranslate

### Baza za duża do importu w phpMyAdmin
→ Skompresuj .sql do .gz (phpMyAdmin akceptuje gzip)
→ Albo podziel plik narzędziem SQL Dump Splitter (darmowe online)

### Stary WordPress nie uruchamia się na nowym serwerze
→ Sprawdź wersję PHP na nowym serwerze — stary WP (sprzed 2022) może nie działać na PHP 8.x
→ Przełącz PHP na 7.4 w panelu hostingu support.topstrony.pl (tymczasowo)
→ Po migracji zaktualizuj WP do najnowszej wersji

---

## PO UDANEJ MIGRACJI — CO DALEJ

1. **Zaktualizuj WordPress** do najnowszej wersji (WP Admin → Kokpit → Aktualizacje)
2. **Zaktualizuj wtyczki** — szczególnie GTranslate, Calameo, i ewentualne pluginy bezpieczeństwa
3. **Zaktualizuj motyw**
4. **Zmień hasło admina** na silne (WP Admin → Użytkownicy → Twój profil)
5. **Zainstaluj Wordfence** lub Sucuri Security (ochrona przed atakami)
6. **Dodaj do wp-config.php:** `define('DISALLOW_FILE_EDIT', true);` (blokuje edycję plików z panelu)
7. **Sprawdź, czy strona nie była zhakowana** — po kilku latach bez aktualizacji to realne ryzyko:
   - Sprawdź `wp-content/` pod kątem podejrzanych plików PHP (np. `shell.php`, `backdoor.php`, pliki z losowymi nazwami)
   - Sprawdź `wp-includes/` i `wp-admin/` czy nie ma dodatkowych plików
   - Zrób skan Wordfence po instalacji

---

## CHECKLIST — PODSUMOWANIE KROKÓW

```
[ ] 1. Eksport bazy danych cominport.pl (phpMyAdmin → Eksport → SQL)
[ ] 2. Pobierz WSZYSTKIE pliki z cominport.pl (FTP → cały katalog)
[ ] 3. Zanotuj dane z wp-config.php (DB_NAME, DB_USER, DB_PASSWORD, prefix)
[ ] 4. Utwórz bazę danych na support.topstrony.pl
[ ] 5. Import bazy (phpMyAdmin → Import → plik .sql)
[ ] 6. Wgraj pliki na support.topstrony.pl (FTP)
[ ] 7. Edytuj wp-config.php (dane bazy + WP_HOME + WP_SITEURL + DEBUG)
[ ] 8. Search & Replace URL (skrypt SRDB lub SQL w phpMyAdmin)
[ ] 9. Napraw .htaccess
[ ] 10. Reset hasła admina (phpMyAdmin → wp_users → MD5)
[ ] 11. Test: strona się ładuje, podstrony, obrazki, tłumaczenia
[ ] 12. Zabezpiecz: robots.txt + noindex + .htpasswd
[ ] 13. Usuń skrypt SRDB jeśli użyty!
[ ] 14. Wyłącz WP_DEBUG
[ ] 15. Zaktualizuj WP + wtyczki + motyw
```
