We're slowly in the process of moving all the libraries to bower. The files in these directories are ones we haven't moved over yet.

This is the process we've been following:
1. Figure out which version of the library is used in lib/
2. Install that version with bower
3. Diff the .js files, to ensure that the lib/ version and the bower version have exactly the same code.
4. Change the Gulpfile to use the bower version of the code
5. Delete the library from lib


