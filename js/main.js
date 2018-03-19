let width = 800
let height = 400
let red = '#f06'
let green = '#c5d5cb'

let draw = SVG('drawing').size(width, height)
let rect1 = draw.rect(100, 100).attr({ fill: red, x: 0, y: 0 })
let rect2 = draw.rect(100, 100).attr({ fill: red, x: 700, y: 0 })
let rect3 = draw.rect(100, 100).attr({ fill: red, x: 0, y: 300 })
let rect4 = draw.rect(100, 100).attr({ fill: red, x: 700, y: 300 })

let ellipse = draw.ellipse(175, 50).fill('#f06').move(width / 2 -75, height / 2 - 25)


setInterval(() => {
    ellipse.animate(500, '-', 0).rotate(360)
}, 500);

svgArray = [rect1, rect2, rect3, rect4]


setInterval(() => {
    svgArray.forEach(el => {
        move(el);
    })
}, 2000);


function move(el) {
    let options = {}
    if (el.attr('fill') === green) {
        options.fill = red
    }
    else {
        options.fill = green
    }
    let x = el.attr('x')
    let y = el.attr('y')
    if(x == 0 && y == 0) {
        options.x = 700
        options.y = 0
    }
    else if(x == 700 && y == 0) {
        options.x = 700
        options.y = 300
    }
    else if(x == 700 && y == 300) {
        options.x = 0
        options.y = 300
    }
    else if(x == 0 && y == 300) {
        options.x = 0
        options.y = 0
    }
    el.animate(2000, '>', 0).attr(options)
}