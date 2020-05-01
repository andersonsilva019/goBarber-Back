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
      bee.process(handle);
    })
  }
}

module.exports = new Queue();
