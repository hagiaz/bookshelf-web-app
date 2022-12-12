const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const id = generateId();
    const title = document.getElementById('judul').value;
    const author = document.getElementById('penulis').value;
    const year = document.getElementById('tahun').value;
    const isComplete = document.getElementById('complete').checked;
   
    const BookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(BookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    
    saveData();
    alert("Buku berhasil ditambahkan.")
    document.getElementById('judul').value = "";
    document.getElementById('penulis').value = "";
    document.getElementById('tahun').value = "";
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBooks = document.getElementById('belumselesai');
    uncompletedBooks.innerHTML = '';

    const completedBooks = document.getElementById('selesai');
    completedBooks.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBooks.append(bookElement);
        }
        else{
            completedBooks.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const judulBuku = document.createElement('p');
    judulBuku.innerText = bookObject.title;
   
    const penulisBuku = document.createElement('p');
    penulisBuku.innerText = bookObject.author;
   
    const tahunBuku = document.createElement('p');
    tahunBuku.innerText = bookObject.year;


    const judulContainer = document.createElement('td');
    judulContainer.classList.add('inner');
    judulContainer.append(judulBuku);

    const penulisContainer = document.createElement('td');
    penulisContainer.classList.add('inner');
    penulisContainer.append(penulisBuku);

    const tahunContainer = document.createElement('td');
    tahunContainer.classList.add('inner');
    tahunContainer.append(tahunBuku);
   
    const container = document.createElement('tr');
    container.classList.add('item', 'shadow');
    container.append(judulContainer, penulisContainer, tahunContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('belumselesai');
        undoButton.innerText = "Tandai belum selesai";

        const eraseButton = document.createElement('button');
        eraseButton.classList.add('hapus');
        eraseButton.innerText = "Hapus buku";

        undoButton.addEventListener('click', function(){
            undoBookFromCompleted(bookObject.id);
        });

        eraseButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, eraseButton);
    }
        
    else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('selesai');
        checkButton.innerText = "Tandai sudah selesai";

        const eraseButton = document.createElement('button');
        eraseButton.classList.add('hapus');
        eraseButton.innerText = "Hapus buku";

        checkButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        eraseButton.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });
        
        container.append(checkButton, eraseButton);
    }
     
    return container;
}


function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dipindahkan.")
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dihapus.")
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    alert("Buku berhasil dipindahkan.")
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert('Mohon maaf, Browser ini tidak mendukung local storage.');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const bookData of data) {
        books.push(bookData);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}