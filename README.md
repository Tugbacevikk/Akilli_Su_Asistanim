# Akıllı Su Asistanım - Web Arayüzü (Frontend Prototip)

TÜBİTAK 2209-A "Sanal Su Asistanım" araştırma önerisi kapsamında tasarlanan
kullanıcı arayüzünün mobil öncelikli (mobile-first) statik prototipidir.
Bursa'daki baraj doluluk durumu, hava koşulları ve kişisel su kullanımını
tek bir panelde bir araya getirir.

## Mevcut Durum (Önemli — Dürüst Özet)

Bu proje bir **arayüz (UI) prototipidir**, uçtan uca çalışan bir sistem değildir:

- **Gerçek olan:** Sayfa navigasyonu, tema değiştirme (koyu/açık), duş/musluk/sifon
  girdilerinden anlık litre hesaplama, kullanım kayıtlarının tarayıcının
  `localStorage`'ında saklanması, CSV dışa aktarma, Chart.js grafikleri.
- **Simüle/sabit olan:** Baraj doluluk oranları (%68 gibi değerler), hava
  durumu verisi, haftalık tüketim grafiği ve "Gelecek Tahmini" sekmesindeki
  tahmin — bunlar gerçek bir veritabanına veya API'ye bağlı değildir,
  sayfa içinde sabit (hardcoded) örnek değerlerdir.
- **"ML Tahmini" hakkında önemli not:** `updateMLPrediction()` fonksiyonu
  gerçek bir eğitilmiş makine öğrenmesi modeli çalıştırmaz. Sabit katsayılarla
  yazılmış basit bir doğrusal formüldür (`18.5 + 2.1×sıcaklık − 0.35×nem −
  0.4×baraj + 0.55×önceki_tüketim`), tarayıcıda anlık hesaplanır. Gerçek,
  scikit-learn ile eğitilmiş model ayrı bir Python/Flask prototipinde
  bulunmaktadır (bkz. `ml_model.py`), bu arayüzde henüz ona bağlanmamıştır.
- Kalıcı/paylaşılan bir veritabanı **yoktur** — veriler tarayıcı hafızasında
  tutulur, farklı cihaz/tarayıcıda görünmez.

## Kurulum ve Çalıştırma

Node.js gerektirir (ekstra bağımlılık yoktur, sadece yerleşik `http` modülü kullanılır).

```bash
node server.js
```

Tarayıcıda `http://localhost:3000` adresine gidin.

## Sayfa Yapısı

| Sekme | İçerik |
|---|---|
| Ana Sayfa | Günlük özet, baraj/hava durumu kartları, haftalık tüketim grafiği |
| Su Girişi Ekle | Duş/musluk/sifon/makine kullanımından anlık litre hesaplama ve kayıt |
| Barajlar & Hava | Baraj doluluk dağılımı (pasta grafik), sıcaklık-tüketim korelasyonu, geçmiş baraj verisi |
| Gelecek Tahmini | Kaydırıcılarla (sıcaklık, nem, baraj, önceki tüketim) anlık tahmin |
| Tasarruf İpuçları | Sabit metinlerle günlük pratik öneriler |
| Fatura & Rapor | Aylık toplam/tahmini fatura özeti, CSV indirme, yazdırma |

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `index.html` | Sayfa yapısı, sekmeler, form ve modal öğeleri |
| `app.js` | Navigasyon, tema değiştirme, litre hesaplama, kayıt yönetimi (localStorage), CSV export |
| `charts.js` | Chart.js ile 4 görselleştirme (haftalık tüketim, baraj dağılımı, sıcaklık korelasyonu, geçmiş baraj verisi) |
| `styles.css` | Koyu/açık tema, mobil öncelikli responsive tasarım |
| `server.js` | Statik dosya sunucusu (Node.js `http` modülü) |
| `package.json` | Proje meta bilgisi ve çalıştırma script'i |

## Sonraki Adımlar

- [ ] `ml_model.py`'daki gerçek eğitilmiş regresyon modelini bu arayüze
      (bir API endpoint üzerinden) bağlamak
- [ ] Baraj doluluk ve hava durumu verilerini DSİ/MGM'den canlı çekmek
- [ ] `localStorage` yerine kalıcı bir veritabanı (SQLite/PostgreSQL) kullanmak
- [ ] Çok kullanıcılı kimlik doğrulama eklemek
