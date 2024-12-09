fetch('inventory.json')
    .then(response => response.json())
    .then(data => {
        const featuredBeerList = document.getElementById('featured-beer-list');
        data.featured.forEach(beer => {
            const beerDiv = document.createElement('div');
            beerDiv.innerHTML = `
                <h3>${beer.name}</h3>
                <p>${beer.description}</p>
                <p>Price: $${beer.price}</p>
            `;
            featuredBeerList.appendChild(beerDiv);
        });
    });
