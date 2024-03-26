use libsnark::{zk_proof, zk_verifier};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ZkFile {
    pub content: Vec<u8>, // ZK encryption
    pub proof: Vec<u8>,   // ZK proof
}

impl ZkFile {
    // zk file-content encryption
    pub fn from_bytes(file_content: &[u8]) -> Self {
        // encryption with ZK lib
        let (content, proof) = zk_proof::encrypt(file_content);

        ZkFile { content, proof }
    }

    // function of generate zk proof
    pub fn generate_proof(&self) -> Vec<u8> {
        self.proof.clone()
    }

    // function of generate zk verifier
    pub fn verify_proof(&self, proof: &[u8]) -> bool {
        zk_verifier::verify(&self.content, proof)
    }

    // Turn type of file to JSON
    pub fn to_json(&self) -> serde_json::Result<String> {
        let json_data = serde_json::json!({
            "content": base64::encode(&self.content),
            "proof": base64::encode(&self.proof),
        });

        serde_json::to_string(&json_data)
    }

    //generated hashed JSON to ZK file
    pub fn from_json(json_data: &str) -> serde_json::Result<Self> {
        let json: serde_json::Value = serde_json::from_str(json_data)?;

        let content = base64::decode(&json["content"].as_str().unwrap())?;
        let proof = base64::decode(&json["proof"].as_str().unwrap())?;

        Ok(ZkFile { content, proof })
    }
}

// save to zk file
pub fn save_to_file(zk_file: &ZkFile, path: &str) -> std::io::Result<()> {
    let json_data = zk_file.to_json()?;

    std::fs::write(path, json_data)
}

// loader
pub fn load_from_file(path: &str) -> serde_json::Result<ZkFile> {
    let json_data = std::fs::read_to_string(path)?;

    ZkFile::from_json(&json_data)
}

// calculate file size
    pub fn file_size(&self) -> u64 {
        self.content.len() as u64
    }

    // calculate hash
    pub fn hash(&self) -> [u8; 32] {
        let mut hasher = Sha256::new();
        hasher.update(&self.content);
        hasher.finalize().into()
    }

    // Added compression and decompression

    #[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq)]
    pub struct ZkFileData {
        pub content: Vec<u8>,
        pub proof: Vec<u8>,
        pub file_name: String,
        pub file_size: u64,
        pub hash: [u8; 32],
    }

    pub fn to_data(&self) -> ZkFileData {
        ZkFileData {
            content: self.content.clone(),
            proof: self.proof.clone(),
            file_name: "".to_string(), // Dosya adını ekleyin
            file_size: self.file_size(),
            hash: self.hash(),
        }
    }

    pub fn from_data(data: &ZkFileData) -> Self {
        ZkFile {
            content: data.content.clone(),
            proof: data.proof.clone(),
