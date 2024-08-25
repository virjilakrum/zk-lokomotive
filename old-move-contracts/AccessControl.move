address 0x1 {
module AccessControl {
    use 0x1::Signer;
    use 0x1::Vector;
    use 0x1::Option;

    // Dosya erişim bilgilerini tutacak yapı
    struct FileAccess {
        access_list: vector<address>,  // Erişim izni verilen adresler listesi
    }

    // Her dosya hash'ine karşılık gelen erişim bilgilerini tutan yapı
    struct AccessMap has key {
        access_map: vector<(vector<u8>, FileAccess)>,  // Dosya hash'i ve erişim bilgileri çiftlerini içeren vektör
    }

    // Kullanıcı hesabına ilk kez erişim haritası eklendiğinde bu yapıyı oluştur
    public fun initialize(account: &signer) {
        let access_map = AccessMap { access_map: Vector::empty<(vector<u8>, FileAccess)>() };
        move_to(account, access_map);
    }

    // Belirli bir dosya için erişim izni ver
    public fun grant_access(account: &signer, file_hash: vector<u8>, grantee: address) acquires AccessMap {
        let access_map = borrow_global_mut<AccessMap>(Signer::address_of(account));
        let size = Vector::length(&access_map.access_map);
        let mut found = false;
        let mut i = 0;

        while (i < size) {
            let (stored_hash, file_access) = Vector::borrow_mut(&mut access_map.access_map, i);
            if (Vector::equals(stored_hash, &file_hash)) {
                Vector::push_back(&mut file_access.access_list, grantee);
                found = true;
                break;
            };
            i = i + 1;
        };

        // Eğer dosya hash'i yeni ise, yeni bir giriş ekle
        if (!found) {
            let new_access = FileAccess { access_list: Vector::singleton(grantee) };
            Vector::push_back(&mut access_map.access_map, (file_hash, new_access));
        }
    }

    // Belirli bir dosyaya erişim izni olup olmadığını kontrol et
    public fun check_access(account: address, file_hash: vector<u8>, requester: address): bool acquires AccessMap {
        let access_map = borrow_global<AccessMap>(account);
        let size = Vector::length(&access_map.access_map);

        for (i in 0..size) {
            let (stored_hash, file_access) = Vector::borrow(&access_map.access_map, i);
            if (Vector::equals(stored_hash, &file_hash)) {
                let access_size = Vector::length(&file_access.access_list);
                for (j in 0..access_size) {
                    if (Vector::borrow(&file_access.access_list, j) == &requester) {
                        return true;
                    }
                }
            }
        };

        false
    }
}
}
