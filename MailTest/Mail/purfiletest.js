var absPath = "C:\wakanda\file1.dat";
var dataFile = File(absPath);  

var writestream = BinaryStream(dataFile, "Write");

writestream.putBuffer(new Buffer("Test Data\r\n"));

// flush();

