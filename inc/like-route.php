<?php

/**
 * Registers REST API routes for managing likes.
 *
 * @return void
 */
function universityLikeRoutes(){
    register_rest_route( 'university/v1', 'manageLike', array(
        'methods' => 'POST',
        'callback' => 'createLike'
    ));

    register_rest_route( 'university/v1', 'manageLike', array(
        'methods' => 'DELETE',
        'callback' => 'deleteLike'
    ));
}

add_action('rest_api_init', 'universityLikeRoutes');

function createLike(){
    return "Thanks for Like";
}

function deleteLike(){
    return "Thanks for Unlike";
}