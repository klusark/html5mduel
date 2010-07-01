from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from zlib import crc32
import struct
import os

class MainHandler(webapp.RequestHandler):
	def get(self):
		

		self.response.headers['Content-Type'] = "image/png"
		pngsig = '\x89PNG\r\n\x1a\n'
		self.response.out.write(pngsig)
		colours = ['\x61\x70\x00','\x14\x14\xc7','\x00\x45\xba','\x00\x38\xc7','\x00\x51\xae','\x73\x73\x73','\xff\xff\x13','\xff\xff\xff']
		f = open(os.path.dirname(__file__) + '/player.png', 'rb')
		f.seek(0)
		# verify that we have a PNG file
		if f.read(len(pngsig)) != pngsig:
			raise RuntimeError('not a png file!')
		found = False
		while not found:
			
			chunkstr = f.read(8)
			self.response.out.write(chunkstr)
			if len(chunkstr) != 8:
				# end of file
				break

			# decode the chunk header
			length, chtype = struct.unpack('>L4s', chunkstr)
			#print length
			#print chtype
			# we only care about palette chunks
			if chtype == 'PLTE':
				found = True
				curpos = f.tell()
				paldata = f.read(length)
				
				# change the 3rd palette entry to cyan
				data = ""
				for i in colours:
					data = data + i

				# go back and write the modified palette in-place
				#f.seek(curpos)
				#f.write(data)
				crc = crc32(chtype)
				crc2 = crc32(data, crc)
				self.response.out.write(data + struct.pack('>L', crc2 & 0xFFFFFFFF))
				f.seek(4, os.SEEK_CUR)

				#f.write(struct.pack('>L', crc2 & 0xFFFFFFFF))
				
			else:
				# skip over non-palette chunks
				self.response.out.write(f.read(length+4))
	
		while True:
			chunkstr = f.read(32)
			self.response.out.write(chunkstr)
			if (len(chunkstr) != 32):
				break
		


def main():
	application = webapp.WSGIApplication([('/test', MainHandler)],
										 debug=True)
	util.run_wsgi_app(application)


if __name__ == '__main__':
	main()
