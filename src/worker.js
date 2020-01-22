import throng from 'throng';
import Queue from 'bull';
import debug from 'debug';
import redis from 'redis';
import UserModel from './model/users';

redis.createClient();
debug('app:worker')('worker started');


// Connect to a local redis intance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 12;

// The maxium number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;


function start() {
  // Connect to the named work queue
  const workQueue = new Queue('work', { redis: { port: 6379, host: '127.1.1.0' } });
  workQueue.process(maxJobsPerWorker, async (job, done) => {
    // This is an example job that just slowly reports on progress
    // while doing no work. Replace this with your own job logic.
    // let counter = 0;
    // const { data } = job;

    // while (counter < data.length) {
    //   const author = await UserModel.findById(data[counter].authorId);
    //   const img = `https://res.cloudinary.com/adefizzy/image/upload/w_0.2,h_200,c_limit,q_auto/v${data[counter].images[0].version}/${data[counter].images[0].public_id}.${data[counter].images[0].format}`;
    //   data[counter].author = author.name;
    //   data[counter].image = img;
    //   counter += 1;
    //   const progress = (counter / data.length) * 100;
    //   job.progress(progress);
    // }

    // done(null, data);

    debug('app:job')(job.data);
    done();
    // A job can return values that will be stored in Redis as JSON
    // This return value is unused in this demo application.
  });
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
