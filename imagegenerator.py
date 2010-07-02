import struct
from zlib import crc32
import os

# PNG file format signature
pngsig = '\x89PNG\r\n\x1a\n'

colours = ['\x61\x70\x00','\x14\x14\xc7','\x00\x45\xba','\x00\x38\xc7','\x00\x51\xae','\x73\x73\x73','\x00\xf7\x00','\xff\xff\xff']

def swap_palette(filename):
	# open in read+write mode
	with open(filename, 'r+b') as f:
		f.seek(0)
		# verify that we have a PNG file
		if f.read(len(pngsig)) != pngsig:
			raise RuntimeError('not a png file!')
		print f.tell()
		while True:
			chunkstr = f.read(8)
			if len(chunkstr) != 8:
				# end of file
				break

			# decode the chunk header
			length, chtype = struct.unpack('>L4s', chunkstr)
			print length
			print chtype
			# we only care about palette chunks
			if chtype == 'PLTE':
				curpos = f.tell()
				paldata = f.read(length)
				# change the 3rd palette entry to cyan
				data = ""
				for i in colours:
					data = data + i

				# go back and write the modified palette in-place
				f.seek(curpos)
				f.write(data)
				crc = crc32(chtype)
				crc2 = crc32(data, crc)

				f.write(struct.pack('>L', crc2 & 0xFFFFFFFF))
				return;
			else:
				# skip over non-palette chunks
				f.seek(length+4, os.SEEK_CUR)

if __name__ == '__main__':
	import shutil
	shutil.copyfile('images/player.png', 'images/player2.png')
	swap_palette('images/player2.png')
