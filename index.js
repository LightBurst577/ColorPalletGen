const picker = document.getElementById("picker")  
const count = 6



render("ff0000")

document.addEventListener("click", function(e){
    const colorInput = picker.value.slice(1)
    if (e.target.dataset.btn){
        render(colorInput)
    }

    if (e.target.dataset.hex) {
        copyColor(e.target.dataset.hex) 
    }
})


function render(colorInput){
     const mode = document.getElementById("modes").value
    let fetchUrl = `
    https://www.thecolorapi.com/scheme?hex=${colorInput}&mode=${mode}&count=${count}
    `
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    };
    

    fetch(fetchUrl, options)
    .then(response => response.json())
    .then(data => {
        const colorArray = data.colors // takes data of colors
        let colorAreaHTML = ''
        colorArray.forEach(colorsCode => {
        colorAreaHTML += `
        <div class="color-column">
            <label 
                for="${colorsCode.hex.value}" 
                style="background-color: ${colorsCode.hex.value};" 
                class="rectangle"
                data-hex="${colorsCode.hex.value}">
            </label>
            <span 
                id="${colorsCode.hex.value}" 
                class="hex-value" 
                data-hex="${colorsCode.hex.value}">
                ${colorsCode.hex.value}
            </span>
        </div>`
        })
        document.getElementById('colors').innerHTML = colorAreaHTML
    })
    .catch(error => console.error("Error:", error));
}


function copyColor(hexValue) { // a bypass hack since the API does not let me have permission to copy the hex code in my SCIM environment😭
    
    // Create a temporary textarea element a new note pad trick
    const textArea = document.createElement("textarea")
    textArea.value = hexValue //put it inside
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
        document.execCommand('copy') //a steal a that I found in google
        document.getElementById('modal-content').innerHTML = `<p>You have copied: ${hexValue}</p>`
        notificationCopyModal.style.display = 'block' //show up UI
        
        setTimeout(function() { // Close UI pop up once done
            notificationCopyModal.style.display = 'none'
        }, 3000)
    } catch (err) {
        console.error('Unable to copy :(', err)
    }
    
    const activeColumn = document.querySelector(`.color-column:has([data-hex="${hexValue}"])`)
    
    if (activeColumn) {
        activeColumn.classList.add('active-flash')
        setTimeout(() => {
            activeColumn.classList.remove('active-flash')
        }, 150); // Short flash duration
    }
    

    // Clean up the evidence :)
    document.body.removeChild(textArea)
}


