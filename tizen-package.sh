# Check if tizen directory exists.
if [ ! -d "tizen" ]; then
	echo "Tizen directory not found."
	exit
fi

# Change to tizen directory.
cd tizen

# Clean previous build.
ls | grep -v "config.xml\|icon.png" | xargs rm -rf
rm -rf .manifest.tmp;
rm -rf *.wgt;

# Copy dist directory files to tizen directory.
cp -R ../dist/* .

# Create tizen package.
tizen package -t wgt
