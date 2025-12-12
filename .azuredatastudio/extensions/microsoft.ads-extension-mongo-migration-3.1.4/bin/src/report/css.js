"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStyling = void 0;
function buildStyling() {
    return `
    <style>

  body {
       margin: 20;
       padding: 0;
	   font-family: Arial, sans-serif;
    }

  .container {
        width: 100%;
        overflow-x: hidden;
    }

  h1 {
        color: #0757A0;
    }

  h2 {
        color: #0757A0;
    }
     
  a:link {
      color: #e50000;
    }
    
  a:visited {
      color: green;
    }
    
  a:hover {
      color: hotpink;
    }
    
  a:active {
      color: blue;
    }

  .link {
        margin: 3px;
    }

  .table-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch; /* for smooth scrolling on iOS */
    }
		
  table {
        width: 100%;
        border-collapse: collapse;
		caption-side: bottom;
    }
  th, td {
        padding: 8px 12px;
        border: 1px solid #ddd;
        text-align: left;
    }
  th {
        background-color: silver;
    }

  table caption {
        font-style: italic;
        text-align:right;
    }

    @media print {
        body {
            margin: 0;
        }
    }
</style>
    `;
}
exports.buildStyling = buildStyling;
//# sourceMappingURL=css.js.map