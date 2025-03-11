import  { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { toast } from 'sonner';



const Query = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState< {error : Boolean , message : string,errorCode : number ,query : string }| null>(null);
  const [loading,setLoading] = useState<Boolean>(false)
  const handleEditorBeforeMount = (monaco: any) => {
    monaco.editor.defineTheme('sql-theme', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword.sql', foreground: '#7f22fe' }, 
        { token: 'operator.sql', foreground: '00ff00' }, 
        { token: 'string.sql', foreground: '#52525c' }, 
        { token: 'number.sql', foreground: '0000ff' }, 
        { token: 'identifier.sql', foreground: '#52525c' }, 
        { token: 'comment.sql', foreground: 'a0a0a0' }, 
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000', 
        'editorCursor.foreground': '#000000', 
        'editor.lineHighlightBackground': '#fdf6ff', 
      },
    });
  };

const runQuery = async () => {
    const body = {
        "connection" : {
             "host": "localhost",
                "port": 3306,
                "database": "adeva",
                "username": "yasser",
                "password": "2006",
                "driver": "mysql"
            
        },
        "query" : query
    };

    try {
            setLoading(true)
            const response = await fetch('http://127.0.0.1:8000/api/query', {
                    method: 'POST',
                    mode : 'cors',
                    headers: {
                            'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
            });

            if (!response.ok) {
                  throw new Error(response.statusText)
            }

            const data = await response.json();
            if(data.error){
                setError(data);
            }else{
                setResults(data);
            }
            console.log(data)
            
    } catch (error: any) {
            toast.error('Error running query');
    }finally{
      setLoading(false)
    }
};

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setQuery(value); 
    }
  };

  return (
    <div className="query-container ps-4 overflow-hidden bg">
    <div className="relative h-[44vh]">
      <Editor
        theme="sql-theme" 
        height="100%" 
        defaultLanguage="sql" 
        value={query} 
        onChange={handleEditorChange} 
        beforeMount={handleEditorBeforeMount} 
        options={{
          selectOnLineNumbers: true, 
          lineNumbers: "on", 
          minimap: { enabled: false }, 
          automaticLayout: true, 
          fontSize: 16, 
        }}
      />
    </div>
      <br />
      {/* Run query button */}
      <button
        className="query-button mt-2 px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 "
        onClick={runQuery}
      >
        Run
      </button>
        {/* Display error message */}
        {error && (
    <div className="alert alert-danger mt-4 p-4 bg-red-50/50  rounded-md text-red-600/70">
        <div className="font-bold mb-2 text-gray-800">Error</div>
        
        <div className="flex mb-2 font-mono text-sm font-bold bg-red-50 p-2 rounded">
            SQL query: 
            <span className="block text-sm font-light text-red-600/70">
               {error.query}
            </span>
            <button
              className="ml-2 px-2 text-xs  bg-violet-500 text-white rounded-md hover:bg-violet-600"
              onClick={() => navigator.clipboard.writeText(error.query)}
            >
              Copy
            </button>
        </div>

        <div className="mt-3 text-sm font-medium">
            <span className="font-bold text-black/80">MySQL said:</span> 
            <span className="block mt-1 bg-red-50 px-2 py-1 rounded">
            {error.errorCode && (
              <>
               #{error.errorCode} <span className='mx-1'>-</span> 
              </>
            )} {error.message}
            </span>
        </div>
    </div>
)}
      {/* Display results table */}
    { results.length > 0 && results[0].rows_affected ? (
      <div className="alert alert-success mt-4 p-2 text-green-800 bg-green-100 border border-green-200 rounded">
        Rows affected: {results[0].rows_affected}
      </div>
    ):
    <table className="query-table mt-4 w-full border-collapse">
      <thead>
        <tr>
        {results.length > 0 && Object.keys(results[0]).map((key) => (
          <th key={key} className="border-b-2 border-gray-300 p-2 text-left">{key}</th>
        ))}
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
        <tr key={index} className="hover:bg-gray-100">
          {Object.values(result).map((value, i) => (
            <td key={i} className="border-b border-gray-300 p-2">{String(value)}</td>
          ))}
        </tr>
        ))}
      </tbody>
    </table>
     }
    
    </div>
  );
};

export default Query;