use libsnark::{zk_proof, zk_verifier};

struct ZkFile {
    content: Vec<u8>, // encryption zk
    proof: Vec<u8>,   // zk proof
}

impl ZkFile {
    // file encryption zk
    fn from_bytes(file_content: &[u8]) -> Self {
        // zk library encryption
        let (content, proof) = zk_proof::encrypt(file_content);

        ZkFile { content, proof }
    }

    // generate proof
    fn generate_proof(&self) -> Vec<u8> {
        self.proof.clone()
    }

    // zk verifier
    fn verify_proof(&self, proof: &[u8]) -> bool {
        zk_verifier::verify(&self.content, proof)
    }
}
