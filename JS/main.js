
const input = document.querySelector('.input')
const list = document.querySelector('.list')
const block = document.querySelector('.block')
const listElemQuantity = 5
let repositories;

const debounce = (fn, debounceTime) => {
  let time;
  return function () {
    let fnCall = () => fn.apply(this, arguments)
    clearTimeout(time)
    time = setTimeout(fnCall, debounceTime)
    return time
  }
};


async function go (val) {
  if (val) {
    return await fetch(`https://api.github.com/search/repositories?q=${val}`)
      .then((res) => {
        return res.json()
      })
      .then(i => {
        repositories = i.items
        return createList(listElemQuantity, repositories)
      })
      .catch(() => {
        list.classList.remove('list__active')
      })
  }
}

async function createList(iteration, repos) {
  list.textContent = ''
  for(let i = 0; i < iteration; i++) {
    const listItem = document.createElement('li')
    listItem.classList.add('list__item')
    listItem.id = repos[i].id
    listItem.textContent = `${repos[i].name}`
    list.appendChild(listItem)
  }
}

async function onChange(e) {
  let value = e.target.value
  await go(value)
  if (!/[1-9a-zа-яё]/i.test(value)) {
    list.classList.remove('list__active') 
  } else {
    list.classList.add('list__active')
  }
}

function createBlockRepo(name, owner, stars) {

  const blockRepo = document.createElement('div')
  const p1 = document.createElement('p')
  const p2 = document.createElement('p')
  const p3 = document.createElement('p')
  const button = document.createElement('button')

  blockRepo.classList.add('block__repo')
  button.classList.add('button')

  p1.textContent = `name: ${name}`
  p2.textContent = `owner: ${owner}`
  p3.textContent = `stars: ${stars}`

  block.appendChild(blockRepo)
  blockRepo.appendChild(p1)
  blockRepo.appendChild(p2)
  blockRepo.appendChild(p3)
  blockRepo.appendChild(button)
}

function onClick(e) {
  let targetBlock = e.target
  for(let i = 0; i < listElemQuantity; i++) {
    if (targetBlock.id == repositories[i].id)  createBlockRepo(repositories[i].name, repositories[i].owner.login, repositories[i].watchers)
  }
  list.classList.remove('list__active')
  input.value = ""
}

onChange = debounce(onChange, 250)

input.addEventListener('keyup', onChange)

list.addEventListener('click', onClick)

block.addEventListener('click', (e) => {
  let el = e.target
  if(el.classList.contains('button')) el.parentElement.remove()

})



