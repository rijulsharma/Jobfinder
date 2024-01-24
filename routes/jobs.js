const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const jwtVerify = require("../middlewares/authMiddleware");

router.post("/create", jwtVerify, async (req, res) => {
    try {
        const { companyName, logoUrl, title, description } = req.body;

        if (!companyName || !logoUrl || !title || !description) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        jobDetails = new Job({
            companyName,
            logoUrl,
            title,
            description,
            refUserId: req.body.userId,
        });

        await jobDetails.save();

        res.json({ message: "New job created successfully" });
    } catch (error) {
        console.log(error);
    }
});

router.post("/edit/:jobId", jwtVerify, async (req, res) => {
    try {
        const { companyName, logoUrl, title, description } = req.body;
        const jobId = req.params.jobId;

        if (!companyName || !logoUrl || !title || !description || !jobId) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        await Job.updateOne(
            { _id: jobId },
            {
                $set: {
                    companyName,
                    logoUrl,
                    title,
                    description,
                },
            }
        );

        res.json({ message: "Job details updated successfully" });
    } catch (error) {
        console.log(error);
    }
});

router.get("/job-description/:jobId", async (req, res) => {
    try {
        const jobId = req.params.jobId;

        if (!jobId) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }

        const jobDetails = await Job.findById(jobId);

        res.json({ data: jobDetails });
    } catch (error) {
        console.log(error);
    }
});

router.get("/all", async (req, res) => {
    try {
        const title = req.query.title || "";
        const skills = req.query.skills;
        let filterSkills = skills?.split(",");

        let filter = {};

        if (filterSkills) {
            filter = { skills: { $in: [...filterSkills] } };
        }

        const jobList = await Job.find(
            {
                title: { $regex: title, $options: "i" },
                ...filter,
            }
            // { companyName: 1 }
        );

        res.json({ data: jobList });
    } catch (error) {
        console.log(error);
    }
});

router.delete("/job/:jobId", async (req, res) => {
    try {
        const title = req.query.title || "";
        const jobList = await Job.deleteById(jobId);

        // add filter in the find query with skills
        // ["html", "css", "js"] this is how skill should be saved in database document

        res.json({ data: jobList });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;