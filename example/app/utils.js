function createBtn(text, onClick) {
  const btn = document.createElement('button')
  btn.textContent = text
  btn.addEventListener('click', onClick)
  document.body.append(btn)
}

async function sleep(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}

export { createBtn, sleep }
