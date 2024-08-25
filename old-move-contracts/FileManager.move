address 0x1 {
module FileManager {
    use 0x1::Vector;
    use 0x1::Signer;

    // Dosya bilgilerini tutacak yapı
    struct FileMeta has key {
        hash: vector<u8>,
        ipfs_link: vector<u8>,
        zero_knowledge_proof: vector<u8>,
        owner: address,
    }

    // Kullanıcı başına dosya meta verilerini depolayan yapı
    struct Files has key {
        files: vector<FileMeta>,
    }

    // Bir kullanıcıya ilk dosya eklendiğinde bu yapıyı oluştur
    public fun initialize(account: &signer) {
        let files = Files { files: Vector::empty<FileMeta>() };
        move_to(account, files);
    }

    // Yeni bir dosya meta verisi eklemek için kullanılır
    public fun add_file(account: &signer, hash: vector<u8>, ipfs_link: vector<u8>, proof: vector<u8>) acquires Files {
        let file_meta = FileMeta {
            hash: hash,
            ipfs_link: ipfs_link,
            zero_knowledge_proof: proof,
            owner: Signer::address_of(account),
        };

        // Kullanıcının dosya listesine erişim sağla ve yeni dosya meta verisini ekle
        let files = borrow_global_mut<Files>(Signer::address_of(account));
        Vector::push_back(&mut files.files, file_meta);
    }

    // Dosya meta verilerini hash değerine göre sorgulamak için kullanılır
    public fun get_file(account: address, file_hash: vector<u8>): vector<u8> acquires Files {
        let files = borrow_global<Files>(account);
        let size = Vector::length(&files.files);
        let i = 0;

        while (i < size) {
            let file_meta = Vector::borrow(&files.files, i);
            if (Vector::equals(&file_meta.hash, &file_hash)) {
                return file_meta.ipfs_link;
            };
            i = i + 1;
        };

        // Eğer dosya bulunamazsa boş bir vektör döndür
        vector<u8>{}
    }
}
}
