from google.appengine.ext import webapp
from google.appengine.ext import db
from google.appengine.ext.webapp import util
from google.appengine.ext import blobstore

from zlib import crc32
import struct
import os
import png

class Image(db.Model):
	image = db.BlobProperty()



class MainHandler(webapp.RequestHandler):
	def get(self):
		self.response.headers['Content-Type'] = "image/png"
		m = 1
		filename = 'player.png'
		sprites = False
		sample = False
		colour = 0
		m=1
		colours = [\
		((97, 112, 0, 0), (115, 0, 0, 255), (131, 0, 0, 255), (147, 0, 0, 255), (215, 43, 0, 255), (115, 115, 115, 255), (255, 255, 19, 255), (255, 255, 255, 255)),\
		((97, 112, 0, 0), (20, 20, 199, 255), (0, 69, 186, 255), (0, 56, 199, 255), (0, 81, 174, 255), (115, 115, 115, 255), (0, 199, 0, 255), (255, 255, 255, 255)),\
		((97, 112, 0, 0), (101, 154, 0, 255), (81, 162, 0, 255), (81, 174, 0, 255), (215, 43, 0, 255), (115, 115, 115, 255), (16, 0, 239, 255), (255, 255, 255, 255)),\
		((97, 112, 0, 0), (89, 0, 166, 255), (97, 0, 146, 255), (97, 0, 146, 255), (85, 0, 68, 255), (115, 115, 115, 255), (255, 255, 255, 255), (255, 255, 255, 255))]

		if u'sample' in self.request.GET:
			filename = 'playersample.png'
			sample = True
		if u's' in self.request.GET:
			sprites = True
			filename = 'sprites.png'
		if u'c' in self.request.GET:
			colour = int(self.request.GET['c'])
			if colour >= len(colours):
				colour = 0
		if u'm' in self.request.GET:
			m = int(self.request.GET['m'])

		key = "m"+str(m)
		if sprites:
			key += "s"
		else:
			if sample:
				key+= "sample"
			key += "c"+str(colour)
		#print key
		

		#query_str = "SELECT * FROM Image WHERE key_name=:1'"+key+"'"
		#images = db.GqlQuery("SELECT * FROM Image WHERE key_name=:1",key)
		#results = images.fetch(10)
		#print len(results)
		#return
		img = Image.get_by_key_name(key)
		if img:
			self.response.out.write(img.image)
			return

		f = png.Reader("./images/" + filename)
		width, height, pixels, metadata = f.read_flat()
		pixels = self.scale(pixels, m, width, height)
		if sprites:
			palette = f.palette()
		else:
			palette = colours[colour]
		w = png.Writer(width=width*m, height=height*m, palette=palette, compression=9)
		#f = open('./test.png', 'wb')
		result = w.write_array(f, pixels)
		

			
		image = Image(key_name=key)
		image.image = result
		image.put()
		self.response.out.write(result)

		
	def scale(self, pixels, scale, w, h):
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


	def passthrough(self, f):
		result = ""
		while True:
			chunkstr = f.read(32)
			result += chunkstr
			if (len(chunkstr) != 32):
				break
		return result

def main():
	application = webapp.WSGIApplication([('/generate', MainHandler)],
										 debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
