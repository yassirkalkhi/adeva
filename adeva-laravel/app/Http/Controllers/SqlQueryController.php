<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Exception;

class SqlQueryController extends Controller
{
    public function query(Request $request)
    {
        $credentials = $request->json()->all();
        $connection = $credentials['connection'];
        $query = $credentials['query'];

        $query = trim($credentials['query']);
        
        if (empty($query)) {
            return response()->json(['error' => true, 'message' => "Empty SQL query", 'errorCode' => "", 'query' => $query]);
        }


        $this->setDatabaseConnection($credentials['connection']);
        try {
            $queryType = strtolower(strtok($query, " "));
            $resultSetQueries = ['select', 'show', 'describe', 'explain'];
            if (in_array($queryType, $resultSetQueries)) {
                $pdo = DB::connection('dynamic')->getPdo();
                $pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, true); // Enable multiple statements
                $result = $pdo->exec($query);
                return response()->json($result);
            }
            $result = DB::connection('dynamic')->getPdo()->exec($query);
            return response()->json([['rows_affected' => $result]]);
            
        } catch (Exception $e) {
            return response()->json(['error' => true, 'message' => $e->getMessage(), 'errorCode' => $e->getCode(), 'query' => $query]);
        }
    }

    /**
     *
     * @param array 
     * @return void
     */
    private function setDatabaseConnection(array $credentials)
    {
        $driver = $credentials['driver'];

        Config::set("database.connections.dynamic", [
            'driver' => $driver, 
            'host' => $credentials['host'],
            'port' => $credentials['port'] ?? ($driver === 'mysql' ? 3306 : 5432), 
            'database' => $credentials['database'],
            'username' => $credentials['username'],
            'password' => $credentials['password'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
        ]);

        DB::setDefaultConnection('dynamic');
    }
}
