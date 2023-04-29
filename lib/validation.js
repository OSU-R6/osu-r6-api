/*
  Filters valid fields from object using schema
*/

function filterObj(obj, schema) {
  const validObj = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key in obj && typeof obj[key] === value.type) {
      validObj[key] = obj[key];
    }
  }
  return validObj;
} exports.filterObj = filterObj;


/*
  JSON validation using schema
*/
function validateAgainstSchema(obj, schema) {
  for (const [key, value] of Object.entries(schema)) {
    if (value.required && !(key in obj)) {
      return `${key} is required but missing.`;
    }
    if (key in obj && typeof obj[key] !== value.type) {
      return `${key} should be of type ${value.type}.`;
    }
  }
  return null;
} exports.validateAgainstSchema = validateAgainstSchema;