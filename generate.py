from zlib import crc32
import struct
import os
import png
from flask import Flask
from flask import request
from flask import send_file
app = Flask(__name__)

#class Image(db.Model):
#    image = db.BlobProperty()
def scale(pixels, scale, w, h):
    result = []
    result2= []
    c = 0
    for i in pixels:
        for x in range(scale):
            result2.append(i)
            c += 1
        if (c==w*scale):
            c = 0
            for x in range(scale):
                result.extend(result2)
            result2 = []
    return result



@app.route('/generate')
def MainHandler():
    #self.response.headers['Content-Type'] = "image/png"
    m = 1
    filename = 'player.png'
    sprites = False
    sample = False
    colour = 0
    colours = [\
    ((97, 112, 0, 0), (115, 0, 0, 255), (131, 0, 0, 255), (147, 0, 0, 255), (215, 43, 0, 255), (115, 115, 115, 255), (255, 255, 19, 255), (255, 255, 255, 255)),\
    ((97, 112, 0, 0), (20, 20, 199, 255), (0, 69, 186, 255), (0, 56, 199, 255), (0, 81, 174, 255), (115, 115, 115, 255), (0, 199, 0, 255), (255, 255, 255, 255)),\
    ((97, 112, 0, 0), (101, 154, 0, 255), (81, 162, 0, 255), (81, 174, 0, 255), (81, 174, 0, 255), (115, 115, 115, 255), (16, 0, 239, 255), (255, 255, 255, 255)),\
    ((97, 112, 0, 0), (89, 0, 166, 255), (97, 0, 146, 255), (97, 0, 146, 255), (85, 0, 68, 255), (115, 115, 115, 255), (255, 255, 255, 255), (255, 255, 255, 255)),\
    ((97, 112, 0, 0), (255, 255, 0, 255), (255, 168, 0, 255), (214, 214, 5, 255), (255, 255, 145, 255), (115, 115, 115, 255), (255, 0, 126, 255), (255, 255, 255, 255))]

    if u'sample' in request.args:
        filename = 'playersample.png'
        sample = True
    if u's' in request.args:
        sprites = True
        filename = 'sprites.png'
    if u'c' in request.args:
        colour = int(request.args['c'])
        if colour >= len(colours):
            colour = 0
    if u'm' in request.args:
        m = int(request.args['m'])
    
    if m > 10:
        return

    key = "m"+str(m)
    if sprites:
        key += "s"
    else:
        if sample:
            key+= "sample"
        key += "c"+str(colour)

    #img = Image.get_by_key_name(key)
    #if img:
    #    self.response.out.write(img.image)
    #    return
    f = png.Reader("./images/" + filename)
    width, height, pixels, metadata = f.read_flat()
    pixels = scale(pixels, m, width, height)
    if sprites:
        palette = f.palette()
    else:
        palette = colours[colour]
    w = png.Writer(width=width*m, height=height*m, palette=palette, compression=9)
    f2 = open("test.png", 'w')
    result = w.write_array(f2, pixels)
    f2.close()
    

    #image = Image(key_name=key)
    #image.image = result
    #image.put()
    #self.response.out.write(result)
    return send_file("test.png", mimetype='image/png')
    #return result

    

def passthrough(self, f):
    result = ""
    while True:
        chunkstr = f.read(32)
        result += chunkstr
        if (len(chunkstr) != 32):
            break
    return result



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001)
