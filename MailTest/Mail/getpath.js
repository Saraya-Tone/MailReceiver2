
attachedFilePath = "C:/Users/tone/Documents/Wakanda/attachedfiles/";

folders = new Array();

folders[0] = "Dongguan"
folders[1] = "Shanghai"

folderNumbers = folders.length;

function getpath(subject) {
	for (i=0; i<folderNumbers; i++) {
		var ix = subject.indexOf(folders[i]);
		if (subject.indexOf(folders[i]) >= 0 ) {
			return ( attachedFilePath + folders[i]);
		}	
	}	 
	return ( attachedFilePath + "Others");
}

r = getpath("Shanghai Data");

r = getpath("  Dongguan Data");