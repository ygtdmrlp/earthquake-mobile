# 🌍 QuakeTracker | Modern Deprem Takip Sistemi

QuakeTracker, Türkiye ve çevresindeki deprem aktivitelerini gerçek zamanlı olarak izlemek, analiz etmek ve görselleştirmek için tasarlanmış, **Trae AI** tarzında modern ve futuristik bir web uygulamasıdır.

## 🚀 Öne Çıkan Özellikler

-   **📡 Gerçek Zamanlı Veri**: Kandilli Rasathanesi (KOERI) verileriyle anlık güncellemeler.
-   **🗺️ İnteraktif Harita**: Leaflet.js tabanlı, deprem büyüklüğüne göre dinamik işaretçiler ve detaylı pop-up'lar.
-   **📊 Analiz Merkezi**: Deprem büyüklük dağılımı (Chart.js), istatistikler ve en çok etkilenen bölgeler.
-   **📱 Mobile-First Tasarım**: Mobil cihazlar için özel alt navigasyon menüsü ve dikey kart görünümü.
-   **✨ Futuristik Arayüz**: Koyu mod, neon vurgular, cam morfolojisi (glassmorphism) ve pürüzsüz animasyonlar.
-   **🔔 Akıllı Bildirimler**: Şiddetli depremler için anlık toast bildirimleri.

---

## 📸 Ekran Görüntüleri

*Kendi ekran görüntülerinizi eklemek için aşağıdaki adımları izleyin:*

1.  Projenizin kök dizininde `screenshots` adlı bir klasör oluşturun.
2.  Ekran görüntülerinizi bu klasöre kaydedin (örneğin: `ekran.png`, `ekran2.png`).
3.  Aşağıdaki yer tutucuları kendi dosya yollarınızla güncelleyin.

| Masaüstü Görünümü | Mobil Görünümü |
| :---: | :---: |
| ![Masaüstü Ekran Görüntüsü](ekran.png) | ![Mobil Ekran Görüntüsü](ekran2.png) |

> **İpucu**: GitHub'da resimlerinizi bir issue veya PR'a sürükleyip bırakarak aldığınız URL'leri de buraya yapıştırabilirsiniz.

---

## 🛠️ Kullanılan Teknolojiler

-   **Frontend**: HTML5, CSS3, TailwindCSS, JavaScript (ES6+)
-   **Backend**: Node.js, Express.js
-   **Harita**: Leaflet.js, CartoDB Dark Matter Tiles
-   **Grafikler**: Chart.js
-   **İkonlar**: Lucide Icons
-   **API**: [Kandilli Live API](https://api.orhanaydogdu.com.tr/)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için şu adımları izleyin:

1.  Depoyu klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/quake-tracker.git
    ```
2.  Proje dizinine gidin:
    ```bash
    cd quake-tracker
    ```
3.  Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
4.  Uygulamayı başlatın:
    ```bash
    npm start
    ```
5.  Tarayıcınızda şu adresi açın: `http://localhost:3000`

---

## ⛅ Cloudflare Workers ile Yayınlama

Projeyi Cloudflare Workers (Assets desteğiyle) üzerinde yayınlamak için:

1.  **Wrangler CLI**'ın yüklü olduğundan emin olun.
2.  Terminalden Cloudflare hesabınıza giriş yapın:
    ```bash
    npx wrangler login
    ```
3.  Projeyi yayınlayın:
    ```bash
    npm run worker:deploy
    ```

*Not: API istekleriniz `src/index.js` dosyası üzerinden, statik dosyalarınız ise `public` klasöründen otomatik olarak sunulacaktır.*

---

## ☁️ Cloudflare Pages ile Yayınlama (Alternatif)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

---

**QuakeTracker** - Güvenliğiniz için anlık takip. 🛡️
