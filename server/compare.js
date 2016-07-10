/**
 * Determines if two 2D arrays have the same sub arrays.
 * The sub arrays can be in any order.
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


module.exports = {
    unorderedArray2DEqual
}
