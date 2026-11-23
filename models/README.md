# Custom 3D Car Models (`models/`)

## O'zbekcha Qo'llanma
Tayyor 3D mashina `.glb` fayllaringizni shu **`models/`** papkasiga joylashtiring (masalan: `bmw_m4.glb`, `gentra.glb`, `ferrari.glb`, `malibu.glb`).

1. `.glb` fayllaringizni **`models/`** papkasiga tashlang.
2. GitHub'ga `git add models/ && git commit -m "Add cars" && git push` qiling.
3. **GitHub Actions** avtomatik ishga tushib:
   - `models/` papkasidagi barcha `.glb` fayllarni avtomatik topadi va o'yinga qo'shadi;
   - Har bir mashinaning o'lchami va yo'nalishini avtomatik sozlaydi;
   - O'yinni **Android APK** qilib yig'adi (**Actions -> Build Android APK -> Artifacts** bo'limidan yuklab olishingiz mumkin).
4. O'yinda:
   - Mashinalar boshlang'ich maydon (**Gradient Canopy Drop-Off Plaza**) va kampus yo'llarida turadi.
   - Mashinaga yaqinlashib **`F`** tugmasini bosing (yoki telefonda **"Drive"** tugmasini bosing) va haydang!
   - Yoki yuqoridagi **`Garage [G]`** menyusidan istalgan mashinangizni bir bosishda tanlab minishingiz mumkin.
   - Agar biror `.glb` model teskari qarab qolsa, Garage ichidagi **`Flip 180°`** tugmasini bosing.

---

## English Quick Guide
Drop any `.glb` 3D vehicle models directly into this **`models/`** folder.

- During `npm run dev`, `npm run build`, and the **GitHub Actions APK workflow**, `tools/sync-models.mjs` automatically discovers every `*.glb` file in `models/`, generates `public/models/manifest.json`, and bundles them into the web & Android APK build.
- Every model is automatically scaled to realistic car proportions (~4.45m), grounded flush to `y = 0`, parked on campus bays, and listed in the in-game **Garage (`G`)**.
- Press **`F`** (or tap **Drive / Exit** on Android) to enter or exit any car. Use **WASD** / Touch Pedals to drive, **Space** / **DRIFT** for handbrake drift, and **B** / **HORN** for the car horn.
