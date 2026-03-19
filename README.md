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

## ☁️ Cloudflare Pages ile Yayınlama

Projeyi Cloudflare Pages üzerinde ücretsiz olarak yayınlamak için:

1.  **Cloudflare Dashboard**'a girin.
2.  **Workers & Pages** > **Create application** > **Pages** yolunu izleyin.
3.  GitHub deponuzu bağlayın.
4.  **Build settings** kısmını **TAM OLARAK** şu şekilde doldurun:
    - **Framework preset**: `None`
    - **Build command**: (BOŞ BIRAKIN - HERHANGİ BİR ŞEY YAZMAYIN) ⚠️
    - **Build output directory**: `public`
5.  **Save and Deploy** butonuna tıklayın.

*Not: API istekleriniz `functions/api/earthquakes.js` dosyası üzerinden Cloudflare Functions olarak otomatik çalışacaktır.*

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakabilirsiniz.

---

**QuakeTracker** - Güvenliğiniz için anlık takip. 🛡️
