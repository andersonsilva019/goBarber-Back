const Bee = require('bee-queue')
const CancelationMail = require('../app/jobs/CancellationMail')
const redisCondig = require('../config/redis')
const jobs = [CancelationMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisCondig,
        }),
        handle,
      }
    })
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.on('failed', this.handleFailure).process(handle);
    })
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }

}

module.exports = new Queue();
