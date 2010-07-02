from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.api import images

from zlib import crc32
import struct
import os

class MainHandler(webapp.RequestHandler):
	def get(self):
		
		self.response.headers['Content-Type'] = "image/png"
		pngsig = '\x89PNG\r\n\x1a\n'
		result = pngsig
		#self.response.out.write(pngsig)
		colours = [\
		['\x61\x70\x00','\x73\x00\x00','\x83\x00\x00','\x93\x00\x00','\xd7\x2b\x00','\x73\x73\x73','\xff\xff\x13','\xff\xff\xff'],\
		['\x61\x70\x00','\x14\x14\xc7','\x00\x45\xba','\x00\x38\xc7','\x00\x51\xae','\x73\x73\x73','\x00\xc7\x00','\xff\xff\xff'],\
		['\x61\x70\x00','\x59\x00\xa6','\x61\x00\x92','\x61\x00\x92','\x55\x00\xaa','\x73\x73\x73','\xff\xff\xff','\xff\xff\xff'],\
		['\x61\x70\x00','\x65\x9a\x00','\x51\xa2\x00','\x51\xae\x00','\xd7\x2b\x00','\x73\x73\x73','\x10\x00\xef','\xff\xff\xff']]
		spritesPLTE = '\x00\x00\x00\x5aPLTE\x00\x7b\x92\x27\x27\x27\x3b\x3b\x3b\xff\x00\xff\x57\x57\x57\x00\x73\x73\x00\x93\x63\x00\x93\x67\x73\x73\x73\x00\x97\x63\x00\xa3\x53\x00\xaf\x53\x00\xb3\x43\x87\x87\x87\x00\xbf\x43\x00\xc3\x33\x97\x9f\x9f\xcb\x97\xcb\xd3\xa3\xd3\xd7\xab\xd7\xdb\xb3\xdb\xdf\xbb\xdf\xe3\xc7\xe3\xe7\xcf\xe7\xeb\xd7\xeb\xef\xdf\xef\xf3\xe3\xf3\xf7\xeb\xf7\xfb\xf3\xfb\xff\xff\xff\x5e\x7e\xa2\x5c'
		tRNS = '\x00\x00\x00\x01tRNS\x00\x40\xe6\xd8\x66';
		PLTE = '\x00\x00\x00\x18PLTE'
		filename = 'player.png'
		sprites = False
		sample = False
		colour = 0
		scale = 1
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
			scale = int(self.request.GET['m'])
			

		
		f = open('./images/'+filename, 'rb')
		w = 1000
		h = 49
		if sprites:
			w = 258
			h = 25
		elif sample:
			w = 125
			h = 24
	
		self.response.out.write(images.resize(self.passthrough(f), w*scale, h*scale, images.PNG))
		return
		#result = self.passthrough(f)
		PLTEpos = result.find('PLTE')
		print struct.unpack('>L4s', result[PLTEpos-4:PLTEpos+4])
		return 
		length, chtype = struct.unpack('>L4s', result[PLTEpos-4:PLTEpos+4])
		start = result[:PLTEpos-4]
		if sprites:
			start += spritesPLTE
		else:
			start += PLTE
			data = ''
			for i in colours[colour]:
				data += i
			start += data
			crc = crc32('PLTE')
			crc2 = crc32(data, crc)
			start += struct.pack('>L', crc2 & 0xFFFFFFFF)
		offset = 8
		if result[PLTEpos+length+12:PLTEpos+length+16] != "tRNS":
			start += tRNS
			
			#self.response.out.write(result[PLTEpos+length+12:PLTEpos+length+16])
		else:
			length2 = struct.unpack('>L', result[PLTEpos+length+8:PLTEpos+length+12])[0]
			#offset += 8 + length2
		start += result[PLTEpos+offset+length:]
		
		self.response.out.write(start)


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
