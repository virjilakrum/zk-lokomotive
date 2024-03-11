# this
import requests
import asyncio
import logging
import pika
import time


# Initialize the previous price
def check_timeout(url, previous_coins_based_usdt):
    coin_names_based_dollar = []
    # get api data
    while True:
        try:
            # json formatında data geliyor
            extracted_data = requests.get(url).json()
            break
        except:
            print("awaited")
            time.sleep(60)

    count = 0
    once_set_empty = True
    coins_over_limit_increase = []
    coins_change_rates = []
    limit = 1.5  # LIMIT

    # symbol is name of coin, data is price
    for symbol_and_price in extracted_data:
        # print(symbol_and_price)
        # dolar bazlı degisimi olan coinleri seç, USDT yoksa veya USDT'nin değişimi değilse devam et
        if symbol_and_price['symbol'].find("USDT") != -1 and symbol_and_price['symbol'].find("USDT") != 0:
            # coin isimlerini listeye ekle
            coin_names_based_dollar.append(symbol_and_price['symbol'])
            # ilk çalışış için if'e girme, oran hesaplamak önceki veri ve sonraki veri lazım
            if len(previous_coins_based_usdt) != 0:
                # değişim oranı hesapla (şimdi-eski)/eski değerler
                rates = ((float(symbol_and_price['price']) - float(previous_coins_based_usdt[count])) / float(
                    previous_coins_based_usdt[count])) * 100
                # print(rates)
                # eğer artış belirlenen degerden fazlaysa listelere ekle
                if rates > limit:
                    coins_over_limit_increase.append(symbol_and_price['symbol'])
                    coins_change_rates.append(rates)
                    print(" *** THERE IS A HUGE CHANGE!!! *** ", symbol_and_price['symbol'])
                # tüm değişimleri yaz
                # print(rates)

            count += 1

    # print(coin_names_based_dollar)

    # üstteki aynı düzendeki döngü bitince tekrar döngüye gir (previouses listesi dolu lazım ustte)
    for symbol_and_price in extracted_data:
        if once_set_empty:
            previous_coins_based_usdt = []
            once_set_empty = False
        # previouses listesini boşalt
        # previous_coins_based_usdt = []

        # previouses listesini önceki elemanlarla doldur
        if symbol_and_price['symbol'].find("USDT") != -1 and symbol_and_price['symbol'].find("USDT") != 0:
            #        names.append(i['symbol'])
            previous_coins_based_usdt.append(symbol_and_price['price'])

    return previous_coins_based_usdt, coins_over_limit_increase, coins_change_rates


# stage by stage working


def check_stages(change_time):  # change time is in minute

    previous_coins_based_usdt = []
    while True:

        previous_coins_based_usdt, coins_over_limit_increase, rates = check_timeout(
            url='https://api.binance.com/api/v3/ticker/price',
            previous_coins_based_usdt=previous_coins_based_usdt)
        time.sleep(5*60)

        if len(coins_over_limit_increase) > 0:
            ...
            # send into queue
