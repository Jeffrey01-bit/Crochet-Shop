import fs from 'fs';
import path from 'path';

// Note: since this is a module, we can read products.js and rewrite it.
// Actually, it's easier to just define the base properties and rewrite the whole file.

const baseBaseDir = 'd:\\Crochet App\\public\\products\\Pics';

const productsData = [
    {
        id: 1,
        name: 'Retro Crochet Crop Top',
        price: 1200,
        description: 'Experience the vintage charm with our Retro Crochet Crop Top. Handcrafted to perfection, its intricate pattern and classic design will surely turn heads. Made with high-quality, breathable yarn, it offers both comfort and style. Whether paired with your favorite high-waisted jeans for a casual look or a flowy skirt for a more dressed-up vibe, this crop top is a versatile addition to your wardrobe. Let the warm, radiant glow of this masterpiece elevate your everyday fashion.'
    },
    {
        id: 2,
        name: 'The Cinnabar Corset',
        price: 1800,
        description: 'Add a touch of daring elegance to your wardrobe with The Cinnabar Corset. Its deep red hue and intricate crochet detailing create a stunning, statement-making piece. Designed to hug your curves, this corset is both visually striking and surprisingly comfortable. Let the bold, passionate color ignite your confidence and elevate your style.'
    },
    {
        id: 3,
        name: 'The Clementine Charm',
        price: 2000,
        description: 'Experience the vibrant charm of The Clementine Charm. This exquisite crochet creation features a beautiful, bright orange hue that instantly uplifts any outfit. Its delicate pattern and soft yarn make it a joy to wear, whether you are running errands or attending a special event. Let the cheerful energy of this piece brighten your day and add a touch of sunny elegance to your style.'
    },
    {
        id: 4,
        name: 'The Crimson Scarf',
        price: 1000,
        description: 'Wrap yourself in elegance with The Crimson Scarf. This rich, red crochet scarf is a perfect blend of style and warmth. Its classic design and high-quality yarn make it a versatile accessory that can elevate any winter outfit. The intricate stitching adds a touch of sophisticated charm.'
    },
    {
        id: 5,
        name: 'The Moss Top',
        price: 1500,
        description: 'Embrace the beauty of nature with The Moss Top. This earthy green crochet top is a perfect blend of rustic charm and modern style. Its intricate pattern and comfortable fit make it a versatile piece for everyday wear. The natural, earthy tone adds a touch of grounded elegance to your wardrobe.'
    },
    {
        id: 6,
        name: 'The Rosewood Pullover',
        price: 2200,
        description: 'Experience the delicate elegance of The Rosewood Pullover. This soft, pink crochet piece is a testament to fine craftsmanship. Its intricate pattern and gentle hue create a look that is both romantic and sophisticated. The high-quality yarn ensures a comfortable fit and a piece that will last for years to come.'
    },
    {
        id: 7,
        name: 'The Forever Bloom',
        price: 500,
        description: 'Keep the beauty of spring alive all year round with The Forever Bloom. This delicate crochet flower is a perfect symbol of everlasting beauty and grace. Its soft petals and intricate details make it a beautiful accessory or a thoughtful gift. The warm, inviting color adds a touch of cheerfulness to any space.'
    }
];

const mappedProducts = productsData.map(product => {
    const dirPath = path.join(baseBaseDir, product.name);
    let images = [];
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().match(/\.(jpg|jpeg|png)$/));
        images = files.map(f => `/products/Pics/${product.name}/${f}`);
    }
    return { ...product, images };
});

const output = `export const products = ${JSON.stringify(mappedProducts, null, 2)};\n`;

fs.writeFileSync('d:\\Crochet App\\src\\data\\products.js', output, 'utf8');
console.log('Successfully updated d:\\Crochet App\\src\\data\\products.js');
