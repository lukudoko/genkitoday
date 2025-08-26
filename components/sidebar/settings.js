import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Form,
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Link,
  Spinner,
  Slider,
  Accordion,
  AccordionItem
} from '@heroui/react';
import { HiPencilSquare, HiTrash } from "react-icons/hi2";
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/settingsContext';
import { debounce } from 'lodash';
import { AnimatePresence } from 'framer-motion';

const SentimentFilter = React.memo(({
  sentimentThreshold,
  onSentimentChange,
  isSaving,
  isLoading
}) => {

  const currentDesc = useMemo(() => {
    SentimentFilter.displayName = 'SentimentFilter';
AddFeedForm.displayName = 'AddFeedForm';
FeedItem.displayName = 'FeedItem';
FeedList.displayName = 'FeedList';
    if (isLoading || sentimentThreshold === null) return null;

    if (sentimentThreshold <= -0.75) return {
      label: 'Really Negative',
      message: 'Maybe you like the misery?',
      color: 'rgb(255, 100, 103)'
    };
    if (sentimentThreshold <= -0.375) return {
      label: 'A Little Negative',
      message: 'Always good to be realistic!',
      color: 'rgb(255, 201, 201)'
    };
    if (sentimentThreshold <= -0.1) return {
      label: 'Neutral',
      message: 'Perfectly balanced, as all things should be!',
      color: 'rgb(225, 242, 239)'
    };
    if (sentimentThreshold <= 0.275) return {
      label: 'A Little Positive',
      message: 'Maybe there is good in the world after all!',
      color: 'rgb(150, 247, 228)'
    };
    return {
      label: 'Really Positive',
      message: 'Good vibes ONLY!',
      color: 'rgb(0, 213, 190)'
    };
  }, [sentimentThreshold, isLoading]);

  return (
    <div className='font-noto '>
      <p className="text-xl pb-2 font-semibold">News Filter</p>
      <motion.div
        initial={false}
        animate={{
          borderColor: currentDesc?.color || 'rgb(225, 242, 239)'
        }}
        transition={{ borderColor: { duration: 0.5, ease: "easeInOut" } }}
        className="p-4 rounded-3xl border-4 border-solid"
      >
        {isLoading ? (

          <div className="flex flex-col items-center justify-center py-8">

            <Spinner
              variant="wave"
              classNames={{
                wrapper: "w-full h-full",
                dots: "bg-teal-400 w-2h-2 rounded-full mx-1",
              }}
            />

            <p className="mt-4 text-gray-500">Loading preferences...</p>
          </div>
        ) : (

          <>
            <AnimatePresence mode="wait">
              {currentDesc ? (
                <motion.div
                  key={Math.floor(sentimentThreshold * 100)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-center mb-4"
                >
                  <p className="text-lg font-semibold">{currentDesc.label}</p>
                  <p className="mt-0.5 text-sm text-gray-700">{currentDesc.message}</p>
                </motion.div>
              ) : (
                <div className="h-12 flex items-center justify-center">
                  <Spinner
                    variant="wave"
                    classNames={{
                      wrapper: "w-full h-full",
                      dots: "bg-teal-400 w-2h-2 rounded-full mx-1",
                    }}
                  />
                </div>
              )}
            </AnimatePresence>

            <Slider
              step={0.375}
              maxValue={0.65}
              minValue={-0.85}
              showSteps={true}
              //defaultValue={-0.1}
              classNames={{
                base: "max-w-md p-4",
                filler: "bg-teal-400",
                track: "bg-gray-200",
                thumb: "bg-teal-400 border-teal-400"
              }
              }
              value={sentimentThreshold}
              onChange={onSentimentChange}
              aria-label="Sentiment threshold slider"
              isDisabled={isSaving}
              marks={[
                { value: -0.85, label: 'Negative' },
                { value: -0.375 },
                { value: -0.1, label: 'Neutral' },
                { value: 0.275 },
                { value: 0.65, label: 'Positive' }
              ]}
            />
          </>
        )}
      </motion.div>
    </div>
  );
});

const AddFeedForm = React.memo(({
  newFeedUrl,
  newFeedTitle,
  onUrlChange,
  onTitleChange,
  onSubmit,
  loading,
  isFetchingTitle,
  titleFetchFailed
}) => {
  return (
    <div>
      <p className="text-xl pb-2 font-semibold">Add RSS Feed</p>
      <Form onSubmit={onSubmit} className="space-y-2">
        <Input
          type="url"
          label="Feed URL"
          value={newFeedUrl}
          onChange={onUrlChange}
          isDisabled={loading}
          classNames={{
            input: "bg-white",
            inputWrapper: "bg-white focus-within:!ring-2 focus-within:!ring-teal-400"
          }}
          endContent={
            isFetchingTitle && (
              <Spinner
                size="sm"
                classNames={{
                  circle1: "border-3 border-teal-200",
                }}
              />
            )
          }
          required
        />
        <Input
          type="text"
          label="Title"
          description={titleFetchFailed ? "Unable to fetch title automatically. Please enter a title manually." : "Leave empty to autofill from feed"}
          value={newFeedTitle}
          onChange={onTitleChange}
          isDisabled={loading || isFetchingTitle}
          isRequired
          color={titleFetchFailed ? "warning" : "default"}
          classNames={{
            input: "bg-white",
            inputWrapper: "bg-white focus-within:!ring-2 focus-within:!ring-teal-400"
          }}
        />
        <Button
          type="submit"
          isLoading={loading}
          isDisabled={loading || isFetchingTitle}
          className="w-full bg-teal-400 text-white font-bold"
        >
          Add Feed
        </Button>
      </Form>
    </div>
  );
});

const FeedItem = React.memo(({
  feed,
  isEditing,
  editedFeedUrl,
  editedFeedTitle,
  onEditClick,
  onDeleteFeed,
  onSaveEdit,
  onCancelEdit,
  onEditedUrlChange,
  onEditedTitleChange,
  loading
}) => {
  if (isEditing) {
    return (
      <Card shadow='none' className="border border-teal-400">
        <CardBody>
          <div className="space-y-2">
            <Input
              type="url"
              label="Feed URL"
              value={editedFeedUrl}
              onChange={(e) => onEditedUrlChange(e.target.value)}
              isDisabled={loading}
            />
            <Input
              type="text"
              label="Title"
              value={editedFeedTitle}
              onChange={(e) => onEditedTitleChange(e.target.value)}
              isDisabled={loading}
            />
            <div className="flex gap-2">
              <Button
                onPress={() => onSaveEdit(feed.id)}
                isLoading={loading}
                className="bg-teal-400 text-white flex-1"
              >
                Save
              </Button>
              <Button
                color="default"
                variant="flat"
                onPress={onCancelEdit}
                isDisabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card key={feed.id} shadow='none' className="border border-teal-400">
      <CardBody>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-grow">
            <Link
              href={feed.url}
              isExternal
              className="text-xl font-bold text-black break-all"
            >
              {feed.title || feed.url}
            </Link>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              isIconOnly
              variant="flat"
              size="sm"
              onPress={() => onEditClick(feed)}
              isDisabled={loading}
            >
              <HiPencilSquare />
            </Button>
            <Button
              color="danger"
              isIconOnly
              variant="flat"
              size="sm"
              onPress={() => onDeleteFeed(feed.id)}
              isDisabled={loading}
            >
              <HiTrash />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

const FeedList = React.memo(({
  feeds,
  loading,
  error,
  editingFeedId,
  editedFeedUrl,
  editedFeedTitle,
  onEditClick,
  onDeleteFeed,
  onSaveEdit,
  onCancelEdit,
  onEditedUrlChange,
  onEditedTitleChange
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner
          size="lg"
          classNames={{
            circle1: "border-3 border-teal-200",
          }}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-danger">{error}</div>;
  }

  if (feeds.length === 0) {
    return (
      <div className="text-center py-8 text-default-500">
        No feeds added yet. Add your first feed above!
      </div>
    );
  }

  return (
    <div className="pr-4 space-y-4">
      {feeds.map((feed) => (
        <FeedItem
          key={feed.id}
          feed={feed}
          isEditing={editingFeedId === feed.id}
          editedFeedUrl={editedFeedUrl}
          editedFeedTitle={editedFeedTitle}
          onEditClick={onEditClick}
          onDeleteFeed={onDeleteFeed}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onEditedUrlChange={onEditedUrlChange}
          onEditedTitleChange={onEditedTitleChange}
          loading={loading}
        />
      ))}
    </div>
  );
});

export default function Settings({ userId }) {
  const [rssFeeds, setRssFeeds] = useState([]);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedTitle, setNewFeedTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const [editingFeedId, setEditingFeedId] = useState(null);
  const [editedFeedUrl, setEditedFeedUrl] = useState('');
  const [editedFeedTitle, setEditedFeedTitle] = useState('');
  const [sentimentThreshold, setSentimentThreshold] = useState(null);
  const [isSavingSentiment, setIsSavingSentiment] = useState(false);
  const [titleFetchFailed, setTitleFetchFailed] = useState(false);
  const [isSentimentLoading, setIsSentimentLoading] = useState(true);
  const { markSettingsChanged } = useSettings();

  const saveSentimentThreshold = useCallback(
    debounce(async (threshold) => {
      if (!userId) return;

      setIsSavingSentiment(true);
      try {
        const response = await fetch('/api/user/sentiment', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sentimentThreshold: threshold }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save sentiment preference');
        }

       // console.log('Sentiment threshold saved successfully:', threshold);
        markSettingsChanged();
      } catch (error) {
        console.error('Error saving sentiment threshold:', error);
        setMessage(`Failed to save sentiment preference: ${error.message}`);
      } finally {
        setIsSavingSentiment(false);
      }
    }, 800),
    [userId, markSettingsChanged]
  );

  useEffect(() => {
    const fetchUserSentiment = async () => {
      if (!userId) {
        setIsSentimentLoading(false);
        setSentimentThreshold(-0.1);
        return;
      }

      setIsSentimentLoading(true);
      try {
        const response = await fetch('/api/user/sentiment');
        if (response.ok) {
          const data = await response.json();
          setSentimentThreshold(data.sentimentThreshold ?? -0.1);
        } else {
          setSentimentThreshold(-0.1);
        }
      } catch (error) {
        console.error('Error fetching user sentiment preference:', error);
        setSentimentThreshold(-0.1);
      } finally {
        setIsSentimentLoading(false);
      }
    };

    fetchUserSentiment();
  }, [userId]);

  const fetchRssFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/feeds');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setRssFeeds(data);
    } catch (err) {
      console.error('Failed to fetch RSS feeds:', err);
      setError('Failed to load RSS feeds. Please check your API or login status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRssFeeds();
  }, [fetchRssFeeds]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const fetchTitle = async () => {
      if (!newFeedUrl.trim()) {
        setNewFeedTitle('');
        setTitleFetchFailed(false);
        return;
      }

      try {
        new URL(newFeedUrl);
      } catch {
        setTitleFetchFailed(false);
        return;
      }

      setIsFetchingTitle(true);
      setTitleFetchFailed(false);
      try {
        const response = await fetch(`/api/title?url=${encodeURIComponent(newFeedUrl)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.title) {
            setNewFeedTitle(data.title);
            setTitleFetchFailed(false);
          } else {
            setNewFeedTitle('');
            setTitleFetchFailed(true);
          }
        } else {
          setNewFeedTitle('');
          setTitleFetchFailed(true);
        }
      } catch (err) {
        console.error('Error fetching feed title:', err);
        setNewFeedTitle('');
        setTitleFetchFailed(true);
      } finally {
        setIsFetchingTitle(false);
      }
    };

    const debouncedFetch = debounce(fetchTitle, 500);
    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [newFeedUrl]);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setNewFeedUrl(url);
    setNewFeedTitle('');
    setTitleFetchFailed(false);
  };

  const handleAddFeed = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!userId) {
      setMessage('Please log in to add feeds.');
      return;
    }

    if (!newFeedUrl.trim()) {
      setMessage('Feed URL cannot be empty.');
      return;
    }

    try {
      new URL(newFeedUrl);
    } catch {
      setMessage('Please enter a valid URL.');
      return;
    }

    if (!newFeedTitle.trim()) {
      setMessage('Title is required. Please enter a title for your feed.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newFeedUrl.trim(),
          title: newFeedTitle.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setNewFeedUrl('');
      setNewFeedTitle('');
      setMessage('Feed added successfully!');
      markSettingsChanged();
      fetchRssFeeds();
    } catch (err) {
      console.error('Failed to add RSS feed:', err);
      setMessage(`Failed to add feed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeed = async (feedId) => {
    if (!userId) {
      setMessage('Please log in to delete feeds.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`/api/feeds?id=${feedId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setMessage('Feed deleted successfully!');
      markSettingsChanged();
      fetchRssFeeds();
    } catch (err) {
      console.error('Failed to delete RSS feed:', err);
      setMessage(`Failed to delete feed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (feed) => {
    setEditingFeedId(feed.id);
    setEditedFeedUrl(feed.url);
    setEditedFeedTitle(feed.title || '');
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingFeedId(null);
    setEditedFeedUrl('');
    setEditedFeedTitle('');
    setMessage('');
  };

  const handleSaveEdit = async (feedId) => {
    if (!userId) {
      setMessage('Please log in to save edits.');
      return;
    }

    if (!editedFeedUrl.trim()) {
      setMessage('URL cannot be empty.');
      return;
    }

    try {
      new URL(editedFeedUrl);
    } catch {
      setMessage('Please enter a valid URL.');
      return;
    }

    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`/api/feeds?id=${feedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: editedFeedUrl.trim(),
          title: editedFeedTitle.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setMessage('Feed updated successfully!');
      setEditingFeedId(null);
      markSettingsChanged();
      fetchRssFeeds();
    } catch (err) {
      console.error('Failed to update RSS feed:', err);
      setMessage(`Failed to update feed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col font-noto w-full px-2 gap-8">
      {message && (
        <div className='flex justify-center'>
          <Chip
            color={message.includes('successfully') ? 'success' : 'danger'}
            variant="flat"
            className="w-full justify-center"
          >
            {message}
          </Chip>
        </div>
      )}

      <SentimentFilter
        sentimentThreshold={sentimentThreshold}
        onSentimentChange={(value) => {
          setSentimentThreshold(value);
          saveSentimentThreshold(value);
        }}
        isSaving={isSavingSentiment}
        isLoading={isSentimentLoading}
      />

      <AddFeedForm
        newFeedUrl={newFeedUrl}
        newFeedTitle={newFeedTitle}
        onUrlChange={handleUrlChange}
        onTitleChange={(e) => setNewFeedTitle(e.target.value)}
        onSubmit={handleAddFeed}
        loading={loading}
        isFetchingTitle={isFetchingTitle}
        titleFetchFailed={titleFetchFailed}
      />

      <div className='-mx-2 -mt-2'>
        <Accordion
          itemClasses={{
            title: "text-xl pb-2 font-semibold",
          }}
        >
          <AccordionItem key="1" aria-label="Accordion 1" title="Your Feeds">
            <FeedList
              feeds={rssFeeds}
              loading={loading}
              error={error}
              editingFeedId={editingFeedId}
              editedFeedUrl={editedFeedUrl}
              editedFeedTitle={editedFeedTitle}
              onEditClick={handleEditClick}
              onDeleteFeed={handleDeleteFeed}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={handleCancelEdit}
              onEditedUrlChange={setEditedFeedUrl}
              onEditedTitleChange={setEditedFeedTitle}
            />
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}