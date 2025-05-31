const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const fs = require('fs');

async function generateApiClient() {
  console.log('🔄 Generating API client from swagger.json...');
  
  try {
    // Path to the swagger.json file
    const swaggerPath = path.resolve(__dirname, '../../api/public/swagger.json');
    
    // Check if swagger.json exists
    if (!fs.existsSync(swaggerPath)) {
      console.error('❌ swagger.json not found at:', swaggerPath);
      console.log('💡 Make sure the API service is running and swagger.json is generated');
      process.exit(1);
    }

    // Output directory for generated files
    const outputDir = path.resolve(__dirname, '../src/api');
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate API client
    const { files } = await generateApi({
      name: 'Api.ts',
      output: outputDir,
      input: swaggerPath,
      httpClientType: 'axios',
      generateClient: true,
      generateRouteTypes: true,
      generateResponses: true,
      toJS: false,
      extractRequestParams: true,
      extractRequestBody: true,
      extractEnums: true,
      unwrapResponseData: true,
      prettier: {
        semi: true,
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
      },
      defaultResponseAsSuccess: false,
      generateUnionEnums: true,
      typePrefix: '',
      typeSuffix: '',
      enumNamesAsValues: false,
      moduleNameFirstTag: false,
      generateModuleInfo: false,
      addReadonly: false,
      extractingOptions: {
        requestBodySuffix: ['Payload', 'Body', 'Input'],
        requestParamsSuffix: ['Params'],
        responseBodySuffix: ['Data', 'Result', 'Output'],
        responseErrorSuffix: ['Error', 'Fail', 'Fails', 'ErrorData', 'HttpError', 'BadResponse'],
      },
    });

    console.log('✅ API client generated successfully!');
    console.log('📁 Generated files:');
    files.forEach((file) => {
      console.log(`   - ${file.name}`);
    });

    // Create an index.ts file to export the API
    const indexContent = `// Auto-generated API client exports
export * from './Api';
export { Api as ApiClient } from './Api';
`;

    fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
    console.log('   - index.ts');

    console.log('\n🎉 API client generation completed!');
    console.log('💡 You can now import the API client in your components:');
    console.log('   import { ApiClient } from "./api";');
    console.log('   const api = new ApiClient({ baseURL: "http://localhost:3001" });');

  } catch (error) {
    console.error('❌ Error generating API client:', error.message);
    process.exit(1);
  }
}

// Run the generator
generateApiClient();