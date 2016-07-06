/**
 * Determines if two 2D arrays have the same sub arrays.
 * The sub arrays need not be in the same order but
 * should be the same length.
 */
function unorderedArray2DEqual(array1, array2) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    var containsSubset = false;
    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
        	for (var k = 0; k < array1[0].length; k++) {
        		if (array1[i][k] !== array2[j][k]) {
        			break;
        		} else if (k === array1[0].length-1) {
        			containsSubset = true;
        			break;
        		}
        	}
        	if (containsSubset) {
        		array2.splice(j, 1);
        		j--;
        		containsSubset = false;
        		break;
        	} else if (j === array2.length-1) {
        		return false;
        	}
        }
    }

    return true;
}

/**
 * Determines of two 2D arrays have the same subarrays in
 * the same order
 */
function array2DEqual(array1, array2) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0; i < array1.length; i++) {
    	for (var j = 0; j < array1.length; j++) {
	    	if (array1[i][j] !== array2[i][j])
	    		return false;
    	}
    }

    return true;
}

/**
 * Determines of two arrays have the same values in
 * the same order
 */
function arrayEqual(array1, array2) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) {
        return false;
    }

    if (array1.length !== array2.length) {
        return false;
    }

    for (var i = 0; i < array1.length; i++) {
    	if (array1[i] !== array2[i])
    		return false;
    }

    return true;
}

module.exports = {
    unorderedArray2DEqual,
    array2DEqual,
    arrayEqual
}