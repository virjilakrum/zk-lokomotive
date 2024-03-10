# telegram-superb-bot-with-broker
hata verirse import pika kaldırabilirsin veya RabbitMQ indirmeye bakıp indirebilir. <br>
rabbitMQ'da queue'da mesaj birikirse bir anda tüm mesajlar yollanır consume olunca. <br>
❗ O yüzden bug durumunda mesajları temizlemek lazım.

 ## Botfather commands and get token
``` /start``` <br>
 ```/newbot ```<br>
bota isim giriyorsun <br>
sonda bot olcak şekilde username giriyorsun <br>
sana tokenini veriyor ...... : ...... olan  şey. <br>

bota açıklama eklemek <br>
```/setdescription``` <br>

aşağıdan bot falan seçip devam ediyorsun basit zaten. <br>

```pip install -r requirements.txt``` <br>

## Nasıl Çalışır
Telegram botu consumer. 2 tane server var kaynakları geniş olan server producer olacak ve dataları sürekli takip edecek. Küçük serverda telegram ve discord botları çalışacak. Queue'lara abone olacaklar. Her data için (coinler, NFTler, funding vb.) queue'lar olacak. Websocket gibi event handler olarak çalışacak consumerlar ve event olduğunda telegram botu mesaj gönderecek.
<br>

/data_handler büyük serverda<br>
/telegram_bot küçük serverda<br>
RabbitMQ ile bağlantılı.
