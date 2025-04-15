let catalog = document.getElementById("catalog");
let draggedElement = null;

// Load saved data and shop name on start
window.onload = function () {
    try {
        let savedData = localStorage.getItem("catalogData");
        if (savedData) {
            catalog.innerHTML = savedData;
            addDragAndDrop();
        }
        loadSavedShopName(); // Shop-Namen laden und anzeigen
    } catch (error) {
        console.error("Error loading data:", error);
    }
};

// Save current state
function saveData() {
    try {
        localStorage.setItem("catalogData", catalog.innerHTML);
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Add new category
function addCategory() {
    let catDiv = document.createElement("div");
    catDiv.className = "category";
    catDiv.draggable = true;
    catDiv.setAttribute("role", "listitem");
    catDiv.dataset.id = Math.random().toString(36).substr(2, 9); // Eindeutige ID

    let iconSpan = document.createElement("span");
    iconSpan.className = "icon";
    iconSpan.textContent = "⋮";
    iconSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleRenameBox(catDiv.dataset.id, iconSpan);
    });

    let strong = document.createElement("strong");
    strong.textContent = "Neue Kategorie";

    let colorPickerSpan = document.createElement("span");
    colorPickerSpan.className = "color-picker";
    colorPickerSpan.textContent = "🖊️";
    colorPickerSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleColorBox(catDiv.dataset.id, colorPickerSpan);
    });

    let deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "🗑️";
    deleteButton.setAttribute("aria-label", "Kategorie löschen");
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteRow(deleteButton);
    });

    let buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    let addItemButton = document.createElement("button");
    addItemButton.textContent = "+ Artikel";
    addItemButton.addEventListener("click", (event) => {
        event.stopPropagation();
        addItem(addItemButton);
    });
    buttonContainer.appendChild(addItemButton);

    let dragHandleSpan = document.createElement("span");
    dragHandleSpan.className = "drag-handle";
    dragHandleSpan.textContent = "≡";

    catDiv.appendChild(iconSpan);
    catDiv.appendChild(strong);
    catDiv.appendChild(colorPickerSpan);
    catDiv.appendChild(deleteButton);
    catDiv.appendChild(buttonContainer);
    catDiv.appendChild(dragHandleSpan);

    catalog.appendChild(catDiv);
    addDragAndDrop();
    saveData();
}

// Add new item
function addItem(button) {
    let itemDiv = document.createElement("div");
    itemDiv.className = "item";
    itemDiv.draggable = true;
    itemDiv.setAttribute("role", "listitem");
    itemDiv.dataset.id = Math.random().toString(36).substr(2, 9); // Eindeutige ID

    let iconSpan = document.createElement("span");
    iconSpan.className = "icon";
    iconSpan.textContent = "⋮";
    iconSpan.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleRenameBox(itemDiv.dataset.id, iconSpan);
    });

    let strong = document.createElement("strong");
    strong.textContent = "Neuer Artikel";

    let deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "🗑️";
    deleteButton.setAttribute("aria-label", "Artikel löschen");
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteRow(deleteButton);
    });

    let amountControls = document.createElement("div");
    amountControls.className = "amount-controls";
    let minusButton = document.createElement("button");
    minusButton.textContent = "-";
    minusButton.addEventListener("click", (event) => {
        event.stopPropagation();
        adjustAmount(minusButton, -1);
    });
    let amountSpan = document.createElement("span");
    amountSpan.textContent = "0";
    let plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.addEventListener("click", (event) => {
        event.stopPropagation();
        adjustAmount(plusButton, 1);
    });
    amountControls.appendChild(minusButton);
    amountControls.appendChild(amountSpan);
    amountControls.appendChild(plusButton);

    let dragHandleSpan = document.createElement("span");
    dragHandleSpan.className = "drag-handle";
    dragHandleSpan.textContent = "≡";

    itemDiv.appendChild(iconSpan);
    itemDiv.appendChild(strong);
    itemDiv.appendChild(deleteButton);
    itemDiv.appendChild(amountControls);
    itemDiv.appendChild(dragHandleSpan);

    button.parentElement.parentElement.insertAdjacentElement("afterend", itemDiv);
    addDragAndDrop();
    saveData();
}

// Interaction functions
function toggleRenameBox(parentId, icon) {
    let renameBox = document.querySelector(`.rename-box[data-parent-id="${parentId}"]`) || createRenameBox(parentId);
    let isVisible = renameBox.style.display === "block";
    if (isVisible) {
        renameBox.style.display = "none";
    } else {
        let rect = icon.getBoundingClientRect();
        renameBox.style.top = rect.bottom + "px";
        renameBox.style.left = rect.left + "px";
        renameBox.style.display = "block";
    }
}

function createRenameBox(parentId) {
    let renameBox = document.createElement("div");
    renameBox.className = "rename-box";
    renameBox.dataset.parentId = parentId;
    renameBox.style.position = "fixed";
    renameBox.style.zIndex = "2000";
    renameBox.style.display = "none"; // Initial unsichtbar
    renameBox.innerHTML = `
        <input type="text" placeholder="Neuer Name">
        <button onclick="renameItem(this)">✔</button>
    `;
    document.body.appendChild(renameBox);
    return renameBox;
}

function renameItem(btn) {
    let renameBox = btn.parentElement;
    let input = renameBox.querySelector("input");
    let newName = input.value.trim();
    if (newName !== "") {
        let parentId = renameBox.dataset.parentId;
        let parent = document.querySelector(`[data-id="${parentId}"]`);
        if (parent) {
            parent.querySelector("strong").textContent = newName;
        }
    }
    renameBox.style.display = "none";
    saveData();
}

function toggleColorBox(parentId, icon) {
    let colorBox = document.querySelector(`.color-box[data-parent-id="${parentId}"]`) || createColorBox(parentId);
    let isVisible = colorBox.style.display === "block";
    if (isVisible) {
        colorBox.style.display = "none";
    } else {
        let rect = icon.getBoundingClientRect();
        colorBox.style.top = rect.bottom + "px";
        colorBox.style.left = rect.left + "px";
        colorBox.style.display = "block";
    }
}

function createColorBox(parentId) {
    let colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.dataset.parentId = parentId;
    colorBox.style.position = "fixed";
    colorBox.style.zIndex = "2000";
    colorBox.style.display = "none"; // Initial unsichtbar
    let colorOptions = document.createElement("div");
    colorOptions.className = "color-options";
    ['#ffcccb', '#90ee90', '#add8e6', '#ffffe0', '#ffa07a', '#9370db', '#f0e68c', '#20b2aa', '#ff69b4', '#708090'].forEach(color => {
        let colorOption = document.createElement("div");
        colorOption.className = "color-option";
        colorOption.style.background = color;
        colorOption.addEventListener("click", (event) => {
            event.stopPropagation();
            setCategoryColor(parentId, color);
            colorBox.style.display = "none";
        });
        colorOptions.appendChild(colorOption);
    });
    colorBox.appendChild(colorOptions);
    document.body.appendChild(colorBox);
    return colorBox;
}

function setCategoryColor(parentId, color) {
    let category = document.querySelector(`[data-id="${parentId}"]`);
    if (category) {
        category.style.background = color;
    }
    saveData();
}

function deleteRow(btn) {
    if (confirm("Möchten Sie dieses Element wirklich löschen?")) {
        btn.closest(".category, .item").remove();
        saveData();
    }
}

function adjustAmount(btn, change) {
    let span = btn.parentElement.querySelector("span");
    let newValue = Math.max(0, parseInt(span.textContent) + change);
    span.textContent = newValue;
    saveData();
}

// Touch drag-and-drop for touch devices
function addTouchDragAndDrop(el) {
    let startY;
    let currentTarget;

    el.addEventListener("touchstart", event => {
        draggedElement = el;
        startY = event.touches[0].clientY;
        currentTarget = el;
        el.style.opacity = "0.5";
    });

    el.addEventListener("touchmove", event => {
        event.preventDefault();
        let touchY = event.touches[0].clientY;
        let elements = document.querySelectorAll(".category, .item");
        elements.forEach(elem => {
            let rect = elem.getBoundingClientRect();
            if (touchY > rect.top && touchY < rect.bottom) {
                currentTarget = elem;
            }
        });
    });

    el.addEventListener("touchend", event => {
        el.style.opacity = "1";
        if (currentTarget && draggedElement !== currentTarget) {
            catalog.insertBefore(draggedElement, currentTarget.nextSibling);
            saveData();
        }
        draggedElement = null;
    });
}

// Drag-and-drop for desktop and touch
function addDragAndDrop() {
    document.querySelectorAll(".category, .item").forEach(el => {
        el.draggable = true;

        // Desktop drag-and-drop
        el.ondragstart = event => {
            draggedElement = el;
            setTimeout(() => el.style.display = "none", 0);
        };
        el.ondragover = event => event.preventDefault();
        el.ondragenter = event => {
            if (event.target.classList.contains("category") || event.target.classList.contains("item")) {
                event.target.style.border = "2px dashed #000";
            }
        };
        el.ondragleave = event => {
            event.target.style.border = "1px solid #ccc";
        };
        el.ondrop = event => {
            event.preventDefault();
            if (draggedElement !== el) {
                el.parentNode.insertBefore(draggedElement, el.nextSibling);
            }
            document.querySelectorAll(".category, .item").forEach(e => e.style.border = "1px solid #ccc");
            draggedElement.style.display = "flex";
            saveData();
        };
        el.ondragend = () => {
            draggedElement.style.display = "flex";
        };

        // Touch drag-and-drop
        addTouchDragAndDrop(el);
    });
}

// Generate email with Aptos font, 12px size, and black color
function generateEmail() {
    let shopName = localStorage.getItem("shopName") || "Mein Shop";
    let subject = `Büro-Bestellung für ${shopName} zu nächster Woche`;
    let recipient = "bestellung@einstein-kaffee.de";
    let body = "Hallo Kerstin,\n\n";
    body += `Hier ist die Büro-Bestellung für ${shopName} zu nächster Woche:\n\n`;

    document.querySelectorAll(".category").forEach(category => {
        let items = [];
        let next = category.nextElementSibling;
        while (next && next.classList.contains("item")) {
            let name = next.querySelector("strong").textContent;
            let amount = next.querySelector(".amount-controls span").textContent;
            if (parseInt(amount) > 0) {
                items.push(`${amount}x ${name}`);
            }
            next = next.nextElementSibling;
        }
        if (items.length > 0) {
            body += items.join("\n") + "\n\n";
        }
    });

    body += "Vielen Dank!\n\nLiebe Grüße\n\n";

    // Öffnen eines neuen Fensters mit formatiertem Text
    let newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <html>
            <head>
                <style>
                    body {
                        font-family: 'Aptos', 'Calibri', 'Arial', sans-serif;
                        font-size: 12px;
                        color: black;
                        padding: 20px;
                        line-height: 1.5;
                    }
                    pre {
                        white-space: pre-wrap;
                        margin: 0;
                    }
                </style>
            </head>
            <body>
                <pre>${body}</pre>
            </body>
        </html>
    `);
    newWindow.document.close();

    // Erstellen des mailto-Links
    let encodedSubject = encodeURIComponent(subject);
    let encodedBody = encodeURIComponent(body);
    let mailtoLink = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // Öffnen des Standard-Mailprogramms nach kurzer Verzögerung
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 2000); // 2 Sekunden Verzögerung für vollständiges Rendern
}

// Save shop name and display it subtly
function saveShopName() {
    let shopName = document.getElementById("shopName").value.trim();
    if (shopName !== "") {
        try {
            localStorage.setItem("shopName", shopName);
            document.getElementById("savedShopName").textContent = `Gespeicherter Shop: ${shopName}`;
            alert("Shop-Name gespeichert!");
        } catch (error) {
            console.error("Fehler beim Speichern des Shop-Namens:", error);
        }
    } else {
        alert("Bitte geben Sie einen Shop-Namen ein.");
    }
}

// Load saved shop name on start
function loadSavedShopName() {
    let savedShopName = localStorage.getItem("shopName");
    if (savedShopName) {
        document.getElementById("savedShopName").textContent = `Gespeicherter Shop: ${savedShopName}`;
    }
}

addDragAndDrop();