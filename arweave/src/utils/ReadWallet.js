const readWallet = (walletFile) => {
    const readAsDataURL = (walletFile) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
          reader.abort()
          reject()
        }
        reader.addEventListener("load", () => {resolve(reader.result)}, false)
        reader.readAsText(walletFile)
      })
    }
    return readAsDataURL(walletFile);
  }

  const readDataBuffer = (walletFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => {
        reader.abort()
        reject()
      }
      reader.addEventListener("load", () => {resolve(reader.result)}, false)
      reader.readAsArrayBuffer(walletFile)
    })
  }

  const readBuffer = async (walletFile) => {
    const data = await readDataBuffer(walletFile)
    return {
      name:walletFile.name,
      data
    }
  }

export {
    readWallet,
    readBuffer
}