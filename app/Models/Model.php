<?php

namespace App\Models;

abstract class Model extends \Jchedev\Laravel\Eloquent\Models\Model
{
    /**
     * By default, we dont guard any fields but it can be overwritten on each model if necessary
     *
     * @var array
     */
    protected $guarded = [];
}