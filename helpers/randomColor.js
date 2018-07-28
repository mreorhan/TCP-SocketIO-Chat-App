const colors = ['blue','green','red'];

const randomColors = ()=>{
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColors;