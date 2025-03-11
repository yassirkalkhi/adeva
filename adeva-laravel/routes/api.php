<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SqlQueryController;


Route::post('/query', [SqlQueryController::class, 'query']);