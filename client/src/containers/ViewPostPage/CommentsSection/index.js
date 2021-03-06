import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useAuth0 } from 'contexts/auth0';
import Comment from './Comment';
import { actions as commentDataActions } from 'actions/data/comments';
import { actions as commentRequestActions } from 'actions/requests/comments';
import { actions as viewPostPageActions } from 'actions/ui/viewPostPage';
import Paginator from 'components/Paginator';
import { makeTotalPostCommentCountSelector } from 'selectors/data/comments';
import { makeCurrentUserSelector } from 'selectors/data/users';
import {
  makeCommentListPageNumberSelector,
  makeNumberOfCommentsPerPageSelector,
  makeVisiblePostCommentIdsSelector,
} from 'selectors/ui/viewPostPage';
import styles from './styles';

const useStyles = makeStyles(styles);

const CommentsSection = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { postId } = props;
  const [body, setBody] = useState('');
  const { isLoading } = useAuth0();

  const currentUserSelector = useMemo(makeCurrentUserSelector, []);
  const currentUser = useSelector(currentUserSelector);
  const commentListPageNumberSelector = useMemo(
    makeCommentListPageNumberSelector,
    []
  );
  const commentListPageNumber = useSelector(commentListPageNumberSelector);
  const numberOfCommentsPerPageSelector = useMemo(
    makeNumberOfCommentsPerPageSelector,
    []
  );
  const numberOfCommentsPerPage = useSelector(numberOfCommentsPerPageSelector);
  const visiblePostCommentIdsSelector = useMemo(
    makeVisiblePostCommentIdsSelector,
    []
  );
  const visiblePostCommentIds = useSelector((state) =>
    visiblePostCommentIdsSelector(state, { postId })
  );
  const totalPostCommentCountSelector = useMemo(
    makeTotalPostCommentCountSelector,
    []
  );
  const totalPostCommentCount = useSelector((state) =>
    totalPostCommentCountSelector(state, { postId })
  );

  useEffect(() => {
    dispatch(viewPostPageActions.invokeFetchVisibleCommentsAndAuthors(postId));
  }, [dispatch, postId]);

  useEffect(() => {
    dispatch(viewPostPageActions.setCommentListPageNumber(0));
    dispatch(commentDataActions.fetchTotalPostCommentCount(postId));
  }, [dispatch, postId]);

  const handleBodyChange = (event) => setBody(event.target.value);
  const handleSubmitClick = (event) => {
    event.preventDefault();
    if (!currentUser) return;
    dispatch(commentRequestActions.addCommentToPost(postId, body));
    setBody('');
  };

  const updateCommentListPageNumber = (pageNumber) => {
    dispatch(viewPostPageActions.setCommentListPageNumber(pageNumber));
  };

  const updateNumberOfCommentsPerPage = (count) => {
    dispatch(viewPostPageActions.setNumberOfCommentsPerPage(count));
  };

  const renderCommentForm = () => {
    if (!isLoading && currentUser) {
      return (
        <>
          <TextField
            multiline
            rows={2}
            label='Write a comment..'
            value={body}
            onChange={handleBodyChange}
            className={classes.commentField}
          />
          <div>
            <Button
              variant='contained'
              color='primary'
              onClick={handleSubmitClick}
              className={classes.submitButton}
            >
              Submit
            </Button>
          </div>
        </>
      );
    }
    return null;
  };

  const renderCommentList = () => {
    const commentList = visiblePostCommentIds.map((postCommentId) => (
      <Comment key={postCommentId} commentId={postCommentId} />
    ));
    return commentList;
  };

  return (
    <div className={classes.root}>
      <Typography variant='h5'>Comments ({totalPostCommentCount})</Typography>
      <Paginator
        pageNumber={commentListPageNumber}
        itemsPerPage={numberOfCommentsPerPage}
        totalItemCount={totalPostCommentCount}
        onChangePageNumber={updateCommentListPageNumber}
        onChangeItemsPerPage={updateNumberOfCommentsPerPage}
      />
      {renderCommentForm()}
      {renderCommentList()}
    </div>
  );
};

CommentsSection.propTypes = {
  postId: PropTypes.any.isRequired,
};

export default CommentsSection;
